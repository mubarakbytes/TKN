# App/routes/cart/cart.py
"""API endpoints for managing the user's shopping cart."""
from flask import jsonify, request
from flask_login import current_user, login_required
from . import cart_bp # From App/routes/cart/__init__.py
from services.cart_service import (
    add_to_cart,
    get_cart,
    update_cart_item_quantity,
    remove_from_cart,
    clear_cart # Though not explicitly requested in this step, it's a standard cart function
)
from application.extensions import db # For potential rollback in generic exception handlers

@cart_bp.route('/', methods=['POST'])
@login_required
def add_item_to_cart():
    """Adds an item to the current user's shopping cart."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not product_id or not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"error": "product_id and positive quantity are required."}), 400

    try:
        cart_item_data = add_to_cart(user_id=current_user.id, product_id=product_id, quantity=quantity)
        return jsonify(cart_item_data), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400 # Service raises ValueError for stock issues or bad input
    except Exception as e:
        # db.session.rollback() # Service should handle its own rollback if it performs db operations that fail mid-way
        print(f"Error adding item to cart: {str(e)}") # Log for server
        return jsonify({"error": "An internal error occurred."}), 500

@cart_bp.route('/', methods=['GET'])
@login_required
def view_cart():
    """Retrieves the current user's shopping cart."""
    try:
        cart_data = get_cart(user_id=current_user.id)
        return jsonify(cart_data), 200
    except Exception as e:
        print(f"Error viewing cart: {str(e)}") # Log for server
        return jsonify({"error": "An internal error occurred."}), 500

@cart_bp.route('/items/<int:cart_item_id>', methods=['PUT'])
@login_required
def update_cart_item(cart_item_id):
    """Updates the quantity of an item in the current user's cart."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
        
    quantity = data.get('quantity')

    if quantity is None or not isinstance(quantity, int) or quantity < 0:
        return jsonify({"error": "Valid quantity is required (integer, >= 0)."}), 400

    try:
        updated_cart_data = update_cart_item_quantity(user_id=current_user.id, cart_item_id=cart_item_id, new_quantity=quantity)
        return jsonify(updated_cart_data), 200
    except ValueError as e:
        # Distinguish between item not found (404) and other ValueErrors (400) if possible from message
        if "not found" in str(e).lower():
             return jsonify({"error": str(e)}), 404
        return jsonify({"error": str(e)}), 400 # For insufficient stock or other validation errors
    except Exception as e:
        print(f"Error updating cart item {cart_item_id}: {str(e)}") # Log for server
        return jsonify({"error": "An internal error occurred."}), 500

@cart_bp.route('/items/<int:cart_item_id>', methods=['DELETE'])
@login_required
def remove_item_from_cart_route(cart_item_id):
    """Removes an item from the current user's cart."""
    try:
        updated_cart_data = remove_from_cart(user_id=current_user.id, cart_item_id=cart_item_id)
        return jsonify(updated_cart_data), 200
    except ValueError as e:
        # Specific check for "Cart item not found" to return 404
        if "not found" in str(e).lower():
            return jsonify({"error": str(e)}), 404
        return jsonify({"error": str(e)}), 400 # Should not happen if service only raises ValueError for not found
    except Exception as e:
        print(f"Error removing cart item {cart_item_id}: {str(e)}") # Log for server
        return jsonify({"error": "An internal error occurred."}), 500

# Optional: Clear cart endpoint (not specified in subtask but good to have)
@cart_bp.route('/', methods=['DELETE'])
@login_required
def clear_my_cart():
    """Clears all items from the current user's cart."""
    try:
        cleared_cart_data = clear_cart(user_id=current_user.id)
        return jsonify(cleared_cart_data), 200 # Or 204 No Content with empty body
    except Exception as e:
        print(f"Error clearing cart: {str(e)}") # Log for server
        return jsonify({"error": "An internal error occurred."}), 500
