from flask import Blueprint, jsonify, request
from application.extensions import db
from . import product_bp
from services.product_service import get_all_products # Import the service function

@product_bp.route('/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        # The detailed logic for fetching products is now in product_service.get_all_products
        products_data = get_all_products()
        return jsonify(products_data), 200
    elif request.method == 'POST':
        # TODO: Implement logic to create a new product. This will involve validating request data, interacting with the database, and potentially handling image uploads.
        # Consider creating a create_product service function in product_service.py
        return jsonify({"message": "Product creation not yet implemented"}), 501
