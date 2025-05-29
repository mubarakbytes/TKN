from flask import jsonify
from . import admin_bp # Corrected import for admin_bp
from application.extensions import db
from DataBase.models import Store, User
from utils.decorators import admin_required
from datetime import datetime # Though not strictly needed now, good for future audit fields

@admin_bp.route('/stores', methods=['GET'])
@admin_required
def list_all_stores():
    """Lists all stores with their owner details."""
    try:
        stores = Store.query.all()
        output = []
        for store in stores:
            owner_info = {
                "owner_id": store.owner_id,
                "owner_username": store.owner.username if store.owner else "N/A",
                "owner_email": store.owner.email if store.owner else "N/A"
            }
            output.append({
                "id": store.id,
                "name": store.name,
                "storeUsername": store.storeUsername,
                "is_active": store.is_active,
                "is_verified": store.is_verified,
                "created_at": store.created_at.isoformat() if store.created_at else None,
                "owner": owner_info
            })
        return jsonify(output), 200
    except Exception as e:
        print(f"Error listing all stores: {str(e)}")
        return jsonify({"error": "An internal error occurred while listing stores."}), 500

@admin_bp.route('/stores/<int:store_id>/verify', methods=['POST'])
@admin_required
def verify_store(store_id):
    """Verifies a specific store."""
    try:
        store = Store.query.get(store_id)
        if not store:
            return jsonify({"error": "Store not found."}), 404
        
        store.is_verified = True
        db.session.commit()
        return jsonify({"message": f"Store '{store.name}' verified successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error verifying store {store_id}: {str(e)}")
        return jsonify({"error": "An internal error occurred while verifying the store."}), 500

@admin_bp.route('/stores/<int:store_id>/activate', methods=['POST'])
@admin_required
def activate_store(store_id):
    """Activates a specific store."""
    try:
        store = Store.query.get(store_id)
        if not store:
            return jsonify({"error": "Store not found."}), 404
        
        store.is_active = True
        db.session.commit()
        return jsonify({"message": f"Store '{store.name}' activated successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error activating store {store_id}: {str(e)}")
        return jsonify({"error": "An internal error occurred while activating the store."}), 500

@admin_bp.route('/stores/<int:store_id>/deactivate', methods=['POST'])
@admin_required
def deactivate_store(store_id):
    """Deactivates a specific store."""
    try:
        store = Store.query.get(store_id)
        if not store:
            return jsonify({"error": "Store not found."}), 404
        
        store.is_active = False
        db.session.commit()
        return jsonify({"message": f"Store '{store.name}' deactivated successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deactivating store {store_id}: {str(e)}")
        return jsonify({"error": "An internal error occurred while deactivating the store."}), 500
