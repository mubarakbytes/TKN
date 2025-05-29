# App/services/product_service.py
"""Handles business logic related to product management."""
from DataBase.models import Product, ProductCondition # Import ProductCondition
from application.extensions import db

def get_all_products():
    """Retrieves a list of all products. Currently a placeholder."""
    # TODO: Implement logic to fetch products from the database.
    # Consider pagination, filtering, and sorting.
    # For now, returning an empty list as a placeholder.
    return []

def get_products_by_store_id(store_id):
    """
    Retrieves all products belonging to a specific store.

    Args:
        store_id (int): The ID of the store.

    Returns:
        list: A list of dictionaries, where each dictionary represents a product.
              Returns an empty list if no products are found for the store.
    """
    products = Product.query.filter_by(store_id=store_id).all()
    if not products:
        return []

    products_data = []
    for product in products:
        products_data.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image_url": product.image_url, # Assuming this is a string URL
            "in_stock": product.in_stock,
            "stock_quantity": product.stock_quantity,
            "condition": product.condition,
            "category_id": product.category_id,
            "discount": product.discount,
            "rating": product.rating,
            "number_of_user_rating": product.number_of_user_rating,
            "number_of_sales": product.number_of_sales,
            "is_verified": product.is_verified,
            "is_active": product.is_active,
            "is_banned": product.is_banned,
            "created_at": product.created_at.isoformat() if product.created_at else None,
            "updated_at": product.updated_at.isoformat() if product.updated_at else None
        })
    return products_data

def add_product_to_store(store_id, product_data):
    """
    Adds a new product to a specific store.

    Args:
        store_id (int): The ID of the store to add the product to.
        product_data (dict): A dictionary containing the product details.
                             Expected keys: 'name', 'price', 'stock_quantity', 'condition'.
                             Optional keys: 'description', 'category_id', 'image_url'.

    Returns:
        dict: A dictionary representation of the newly created product.

    Raises:
        ValueError: If required fields are missing, data types are incorrect,
                    or values are out of valid range (e.g., price <= 0).
    """
    required_fields = ['name', 'price', 'stock_quantity', 'condition']
    for field in required_fields:
        if field not in product_data:
            raise ValueError(f"Missing required field: {field}")

    name = product_data['name']
    price = product_data['price']
    stock_quantity = product_data['stock_quantity']
    condition = product_data['condition']

    if not isinstance(name, str) or not name.strip():
        raise ValueError("Product name must be a non-empty string.")
    if not isinstance(price, (int, float)) or price <= 0:
        raise ValueError("Product price must be a number greater than 0.")
    if not isinstance(stock_quantity, int) or stock_quantity < 0:
        raise ValueError("Stock quantity must be an integer greater than or equal to 0.")

    valid_conditions = [ProductCondition.NEW, ProductCondition.USED, ProductCondition.REFURBISHED]
    if condition not in valid_conditions:
        raise ValueError(f"Invalid product condition. Must be one of: {', '.join(valid_conditions)}")

    # Optional fields
    description = product_data.get('description')
    category_id = product_data.get('category_id') # FK check skipped as per instructions
    image_url = product_data.get('image_url')

    new_product = Product(
        store_id=store_id,
        name=name,
        price=price,
        stock_quantity=stock_quantity,
        condition=condition,
        description=description,
        category_id=category_id,
        image_url=image_url,
        # Default values for other fields like is_active, is_verified, etc.,
        # will be handled by the model's defaults or can be set here if needed.
    )

    db.session.add(new_product)
    db.session.commit()

    # Return a dictionary representation of the new product
    return {
        "id": new_product.id,
        "store_id": new_product.store_id,
        "name": new_product.name,
        "description": new_product.description,
        "price": new_product.price,
        "image_url": new_product.image_url,
        "in_stock": new_product.in_stock, # Should be True by default or based on stock_quantity
        "stock_quantity": new_product.stock_quantity,
        "condition": new_product.condition,
        "category_id": new_product.category_id,
        "discount": new_product.discount,
        "rating": new_product.rating,
        "number_of_user_rating": new_product.number_of_user_rating,
        "number_of_sales": new_product.number_of_sales,
        "is_verified": new_product.is_verified,
        "is_active": new_product.is_active,
        "is_banned": new_product.is_banned,
        "created_at": new_product.created_at.isoformat() if new_product.created_at else None,
        "updated_at": new_product.updated_at.isoformat() if new_product.updated_at else None
    }

def update_product_in_store(product_id, store_id, update_data):
    """
    Updates an existing product in a specific store.

    Args:
        product_id (int): The ID of the product to update.
        store_id (int): The ID of the store (for authorization).
        update_data (dict): A dictionary containing the fields to update.

    Returns:
        dict: A dictionary representation of the updated product.

    Raises:
        ValueError: If the product is not found or if validation of fields fails.
        PermissionError: If the product does not belong to the given store_id.
    """
    product = Product.query.get(product_id)
    if not product:
        raise ValueError("Product not found")

    if product.store_id != store_id:
        raise PermissionError("You are not authorized to update this product")

    for key, value in update_data.items():
        if key == 'name':
            if not isinstance(value, str) or not value.strip():
                raise ValueError("Product name must be a non-empty string.")
            product.name = value
        elif key == 'price':
            if not isinstance(value, (int, float)) or value <= 0:
                raise ValueError("Product price must be a number greater than 0.")
            product.price = value
        elif key == 'stock_quantity':
            if not isinstance(value, int) or value < 0:
                raise ValueError("Stock quantity must be an integer greater than or equal to 0.")
            product.stock_quantity = value
        elif key == 'condition':
            valid_conditions = [ProductCondition.NEW, ProductCondition.USED, ProductCondition.REFURBISHED]
            if value not in valid_conditions:
                raise ValueError(f"Invalid product condition. Must be one of: {', '.join(valid_conditions)}")
            product.condition = value
        elif key in ['description', 'category_id', 'image_url', 'in_stock', 'discount', 'is_active']:
            # Assuming 'is_active' and 'in_stock' are booleans, 'category_id' and 'discount' are numbers.
            # More specific validation can be added here if needed.
            setattr(product, key, value)
        # Other fields like 'id', 'store_id', 'rating', 'number_of_user_rating', 'number_of_sales',
        # 'is_verified', 'is_banned', 'created_at', 'updated_at' are generally not updated directly by user.

    db.session.commit()

    return {
        "id": product.id,
        "store_id": product.store_id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "image_url": product.image_url,
        "in_stock": product.in_stock,
        "stock_quantity": product.stock_quantity,
        "condition": product.condition,
        "category_id": product.category_id,
        "discount": product.discount,
        "rating": product.rating,
        "number_of_user_rating": product.number_of_user_rating,
        "number_of_sales": product.number_of_sales,
        "is_verified": product.is_verified,
        "is_active": product.is_active,
        "is_banned": product.is_banned,
        "created_at": product.created_at.isoformat() if product.created_at else None,
        "updated_at": product.updated_at.isoformat() if product.updated_at else None
    }

def delete_product_from_store(product_id, store_id):
    """
    Deletes a product from a specific store.

    Args:
        product_id (int): The ID of the product to delete.
        store_id (int): The ID of the store (for authorization).

    Raises:
        ValueError: If the product is not found.
        PermissionError: If the product does not belong to the given store_id.
    """
    product = Product.query.get(product_id)
    if not product:
        raise ValueError("Product not found")

    if product.store_id != store_id:
        raise PermissionError("You are not authorized to delete this product")

    db.session.delete(product)
    db.session.commit()
