# This file makes the product directory a Python package 

from flask import Blueprint

product_bp = Blueprint('product', __name__)

# Import all routes
from .products import * 