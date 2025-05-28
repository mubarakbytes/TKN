# App/services/cart_service.py
"""Handles business logic related to shopping carts."""
from application.extensions import db
from DataBase.models import Cart, Product, User # User might not be directly used but good for context

def _serialize_cart_item(cart_item):
    """
    Serializes a Cart object into a dictionary, including product details.
    Helper function.
    """
    if not cart_item or not cart_item.product:
        return None # Or raise an error, or return a default structure

    return {
        "id": cart_item.id,
        "user_id": cart_item.user_id,
        "product_id": cart_item.product_id,
        "quantity": cart_item.quantity,
        "product": {
            "id": cart_item.product.id,
            "name": cart_item.product.name,
            "price": cart_item.product.price,
            "image_url": cart_item.product.image_url, # Assuming image_url is a direct attribute
            "current_stock": cart_item.product.stock_quantity,
            "store_id": cart_item.product.store_id # Added store_id
        },
        "item_subtotal": cart_item.quantity * cart_item.product.price
    }

def add_to_cart(user_id, product_id, quantity):
    """
    Adds a product to the user's cart or updates its quantity if it already exists.
    """
    if not isinstance(quantity, int) or quantity <= 0:
        raise ValueError("Quantity must be a positive integer.")

    product = Product.query.get(product_id)
    if not product or not product.is_active: # Assuming is_active implies availability
        raise ValueError("Product not found or not available.")

    # Check initial quantity against stock before fetching cart item
    if product.stock_quantity < quantity and not Cart.query.filter_by(user_id=user_id, product_id=product_id).first():
         # Only raise if it's a new item and quantity is too high
        raise ValueError("Insufficient stock.")


    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

    if cart_item:
        new_quantity = cart_item.quantity + quantity
        if product.stock_quantity < new_quantity:
            raise ValueError("Insufficient stock for updated quantity.")
        cart_item.quantity = new_quantity
    else:
        # Re-check stock for the specific quantity if it's a new item
        # This check is slightly redundant if the initial check above is comprehensive,
        # but it's safer.
        if product.stock_quantity < quantity:
            raise ValueError("Insufficient stock.")
        cart_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    # Re-fetch to ensure product relationship is loaded for serialization, or ensure it's loaded before.
    # For simplicity, we assume cart_item.product is accessible after commit or was loaded.
    # If Product was already queried, cart_item.product might already be populated if relationship is eager/available.
    # If not, a db.session.refresh(cart_item) or re-query might be needed, or ensure Product is loaded via relationship.
    # Let's assume the relationship is available for serialization.
    return _serialize_cart_item(cart_item)


def get_cart(user_id):
    """
    Retrieves the user's shopping cart with all items and total price.
    """
    cart_items_db = Cart.query.filter_by(user_id=user_id).all()
    
    if not cart_items_db:
        return {"items": [], "total_cart_price": 0.0}

    serialized_items = []
    total_cart_price = 0.0

    for item_db in cart_items_db:
        serialized_item = _serialize_cart_item(item_db)
        if serialized_item: # Check if serialization was successful
            serialized_items.append(serialized_item)
            total_cart_price += serialized_item["item_subtotal"]
            
    return {"items": serialized_items, "total_cart_price": total_cart_price}


def update_cart_item_quantity(user_id, cart_item_id, new_quantity):
    """
    Updates the quantity of a specific item in the user's cart.
    If quantity is 0, the item is removed.
    """
    cart_item = Cart.query.filter_by(id=cart_item_id, user_id=user_id).first()
    if not cart_item:
        raise ValueError("Cart item not found.")

    if not isinstance(new_quantity, int) or new_quantity < 0:
        raise ValueError("Quantity cannot be negative.")

    if new_quantity == 0:
        db.session.delete(cart_item)
        db.session.commit()
        return get_cart(user_id) # Return updated cart

    product = Product.query.get(cart_item.product_id)
    # Product should exist if it's in cart, but good to check
    if not product:
        # This indicates a data integrity issue if a cart item exists for a non-existent product
        db.session.delete(cart_item) # Clean up orphan cart item
        db.session.commit()
        raise ValueError("Associated product not found. The cart item has been removed.")

    if product.stock_quantity < new_quantity:
        raise ValueError("Insufficient stock.")
    
    cart_item.quantity = new_quantity
    db.session.commit()
    return get_cart(user_id) # Return updated cart


def remove_from_cart(user_id, cart_item_id):
    """
    Removes a specific item from the user's cart.
    """
    cart_item = Cart.query.filter_by(id=cart_item_id, user_id=user_id).first()
    if not cart_item:
        raise ValueError("Cart item not found.") # As per instruction to raise error
        
    db.session.delete(cart_item)
    db.session.commit()
    return get_cart(user_id) # Return updated cart


def clear_cart(user_id):
    """
    Removes all items from the user's cart.
    """
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    # Return the empty cart state, consistent with other functions
    return get_cart(user_id)
