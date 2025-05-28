from flask import Blueprint

# Import all blueprints
from .auth import auth_bp
from .product import product_bp
from .store import store_bp

# List of all blueprints to register
blueprints = [
    (auth_bp, "/api/auth"),
    (product_bp, "/api/data"),
    (store_bp, "/api/store"),
]
