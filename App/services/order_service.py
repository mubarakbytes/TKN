# App/services/order_service.py
"""Handles business logic related to order management for stores."""
from DataBase.models import Order, OrderItem, Product, OrderStatus # OrderStatus imported
from application.extensions import db
from sqlalchemy.sql import func # For func.now() - although not explicitly used in this function, good for consistency
from services.cart_service import get_cart, clear_cart # Import cart service functions

def get_orders_by_store_id(store_id):
    """
    Retrieves all orders belonging to a specific store, ordered by creation date.

    Args:
        store_id (int): The ID of the store.

    Returns:
        list: A list of dictionaries, where each dictionary represents an order
              and its items. Returns an empty list if no orders are found.
    """
    orders = Order.query.filter_by(store_id=store_id).order_by(Order.created_at.desc()).all()

    if not orders:
        return []

    orders_data = []
    for order in orders:
        order_items_data = []
        for item in order.order_items:
            order_items_data.append({
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price, # Price at the time of purchase
                "product_name": item.product.name if item.product else "Product name not available" # Accessing product name
            })
        
        orders_data.append({
            "id": order.id,
            "user_id": order.user_id, # Buyer's ID
            "total_price": order.total_price,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "updated_at": order.updated_at.isoformat() if order.updated_at else None,
            "order_items": order_items_data
        })
    
    return orders_data

def place_order_from_cart(user_id):
    """
    Places orders from the user's shopping cart, creating separate orders for each store.
    This operation is transactional. If any part fails (e.g., stock issue),
    the entire set of orders for that user from this cart placement attempt will be rolled back.

    Args:
        user_id (int): The ID of the user placing the order.

    Returns:
        list: A list of dictionaries, where each dictionary is a summary of a created order
              (e.g., {"order_id": id, "store_id": store_id, "total_price": price}).

    Raises:
        ValueError: If the cart is empty, a product is unavailable, or stock is insufficient.
        Exception: For other internal errors during the order placement process.
    """
    cart_details = get_cart(user_id)
    cart_items = cart_details.get('items', [])

    if not cart_items:
        raise ValueError("Cannot place an order with an empty cart.")

    stores_items_map = {}
    for item in cart_items:
        # Ensure 'product' and 'store_id' exist to prevent KeyErrors
        if 'product' not in item or 'store_id' not in item['product']:
            # This might indicate an issue with cart serialization or data integrity
            raise ValueError(f"Cart item with ID {item.get('id')} is missing product or store information.")
        
        store_id = item['product']['store_id']
        product_id = item['product']['id']
        quantity = item['quantity']
        price_at_purchase = item['product']['price'] # Assuming price in product dict is the current price

        if store_id not in stores_items_map:
            stores_items_map[store_id] = []
        stores_items_map[store_id].append({
            'product_id': product_id,
            'quantity': quantity,
            'price_at_purchase': price_at_purchase
        })

    created_orders_summary = []
    
    try:
        for store_id, items_in_store in stores_items_map.items():
            current_order_total_price = 0.0
            
            product_ids_for_store = [item['product_id'] for item in items_in_store]
            # Fetch products from DB for this store
            products_from_db = Product.query.filter(Product.id.in_(product_ids_for_store)).all()
            products_in_db_map = {product.id: product for product in products_from_db}

            # Stock Check & Price Calculation (Critical Section for this store's order)
            for item_data in items_in_store:
                product_obj = products_in_db_map.get(item_data['product_id'])
                
                if not product_obj or not product_obj.is_active:
                    raise ValueError(f"Product ID {item_data['product_id']} is not available or found.")
                
                if product_obj.stock_quantity < item_data['quantity']:
                    raise ValueError(f"Insufficient stock for product: {product_obj.name} (ID: {product_obj.id}). Requested: {item_data['quantity']}, Available: {product_obj.stock_quantity}")
                
                # Use price_at_purchase from cart item data, not product_obj.price
                current_order_total_price += item_data['price_at_purchase'] * item_data['quantity']

            # Create Order for this store
            new_order = Order(
                user_id=user_id,
                store_id=store_id,
                total_price=current_order_total_price,
                status=OrderStatus.PENDING # Using imported OrderStatus
            )
            db.session.add(new_order)
            # Flush here to get new_order.id if OrderItem creation relies on it before commit.
            # If using relationship backref appends, flush might not be strictly needed until before commit.
            # For explicit ID usage, flush is safer.
            db.session.flush() 

            # Create OrderItems and Decrement Stock for this store's order
            for item_data in items_in_store:
                product_obj = products_in_db_map.get(item_data['product_id']) # Already fetched and checked
                
                order_item = OrderItem(
                    order_id=new_order.id, 
                    product_id=item_data['product_id'],
                    quantity=item_data['quantity'],
                    price=item_data['price_at_purchase'] # Price at the time of purchase
                )
                db.session.add(order_item)
                
                product_obj.stock_quantity -= item_data['quantity']
            
            created_orders_summary.append({
                "order_id": new_order.id, # Will be populated after flush/commit
                "store_id": new_order.store_id,
                "total_price": new_order.total_price,
                "status": new_order.status
            })

        db.session.commit() # Commit the transaction for all orders
        clear_cart(user_id) # Clear cart after successful order placement

        return created_orders_summary

    except ValueError as ve:
        db.session.rollback()
        raise ve 
    except Exception as e:
        db.session.rollback()
        print(f"Error placing order for user {user_id}: {str(e)}") # Log for server
        # Re-raise a more generic error to the client/route
        raise Exception("An internal error occurred while placing your order. Please try again.")