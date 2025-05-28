# App/routes/order/order.py
"""API endpoints for order management."""
from flask import jsonify # Removed 'request' as it's not used
from flask_login import current_user, login_required
from . import order_bp # From App/routes/order/__init__.py
from services.order_service import place_order_from_cart
from application.extensions import db # For potential use, though service handles its rollback

@order_bp.route('/place', methods=['POST'])
@login_required
def place_new_order():
    """
    Places new orders based on the items in the current user's shopping cart.
    """
    try:
        created_orders_summary = place_order_from_cart(user_id=current_user.id)
        return jsonify({"message": "Orders placed successfully", "orders": created_orders_summary}), 201
    except ValueError as e:
        # Specific ValueErrors from service (e.g., empty cart, stock issue)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Generic exceptions from service (should have been rolled back by service if DB related)
        # or other unexpected errors.
        # The service itself should log detailed errors. This logs the API-level catch.
        print(f"Error placing order via API for user {current_user.id}: {str(e)}") # Log for server
        return jsonify({"error": "An internal error occurred while placing your order."}), 500
