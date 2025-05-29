from flask import Blueprint

# Import all blueprints
from .auth import auth_bp
from .product import product_bp
from .store import store_bp

# Import the admin blueprint
from .admin import admin_bp
from .cart import cart_bp # Import the cart blueprint
from .order import order_bp # Import the order blueprint

# List of all blueprints to register
blueprints = [
    (auth_bp, "/api/auth"),
    (product_bp, "/api/data"), # Assuming /api/data is correct for products, as per current file
    (store_bp, "/api/store"),
    (admin_bp, "/api/admin"), 
    (cart_bp, "/api/cart"),
    (order_bp, "/api/order") # Register the order blueprint
]
