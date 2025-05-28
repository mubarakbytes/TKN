from flask import request, jsonify
from flask_login import login_required, current_user
import base64
from . import store_bp
from application.extensions import db
from DataBase.models import Store, User, ProductCondition # Import ProductCondition
from services.product_service import get_products_by_store_id, add_product_to_store, update_product_in_store, delete_product_from_store # Import product service functions
from services.order_service import get_orders_by_store_id # Import order service function


@store_bp.route('/', methods=['POST'])
@login_required
def create_new_store():
    """Creates a new store for the currently authenticated user."""
    try:
        # Authorization Checks
        if not current_user.can_create_store:
            return jsonify({"error": "You are not authorized to create a store."}), 403
        if current_user.is_seller:
            return jsonify({"error": "You are already a seller."}), 400

        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Request Data Handling & Validation
        name_val = data.get('name')
        store_username_val = data.get('storeUsername')
        location_val = data.get('location')
        store_logo_b64 = data.get('store_logo')
        description_val = data.get('description') # Optional

        if not all([name_val, store_username_val, location_val, store_logo_b64]):
            return jsonify({"error": "Missing required fields (name, storeUsername, location, store_logo are required)"}), 400

        if Store.query.filter_by(storeUsername=store_username_val).first():
            return jsonify({"error": "Store username already exists."}), 400

        # Image Handling
        decoded_logo = None
        if store_logo_b64:
            try:
                # Handle potential prefix like data:image/...;base64,
                if ',' in store_logo_b64:
                    store_logo_b64 = store_logo_b64.split(',')[-1]
                decoded_logo = base64.b64decode(store_logo_b64)
            except Exception as e:
                return jsonify({"error": f"Invalid store_logo image data: {str(e)}"}), 400
        else: # Should have been caught by 'not all' check, but for explicit clarity
            return jsonify({"error": "store_logo is required"}), 400


        decoded_banner = None
        store_banner_b64 = data.get('store_banner')
        if store_banner_b64:
            try:
                if ',' in store_banner_b64:
                    store_banner_b64 = store_banner_b64.split(',')[-1]
                decoded_banner = base64.b64decode(store_banner_b64)
            except Exception as e:
                # Banner is optional, so we can log the error and continue without it
                print(f"Error decoding store_banner: {str(e)}. Proceeding without banner.")
                decoded_banner = None


        # Database Operations
        new_store = Store(
            name=name_val,
            storeUsername=store_username_val,
            location=location_val,
            description=description_val,
            store_logo=decoded_logo,
            store_banner=decoded_banner,
            owner_id=current_user.id,
            is_active=True,
            is_verified=False # Default to False
        )

        current_user.is_seller = True
        # No need to set can_create_store to False, user might want to create another store if allowed by business logic
        # current_user.can_create_store = False 

        db.session.add(new_store)
        db.session.add(current_user) # Or db.session.merge(current_user)
        db.session.commit()

        # Response
        return jsonify({
            "message": "Store created successfully!",
            "store": {
                "id": new_store.id,
                "name": new_store.name,
                "storeUsername": new_store.storeUsername,
                "is_active": new_store.is_active,
                "is_verified": new_store.is_verified
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error during store creation: {str(e)}") # Log the full error for server-side debugging
        return jsonify({"error": "Internal server error during store creation."}), 500


@store_bp.route('/myproducts', methods=['GET', 'POST']) # Added POST method
@login_required
def manage_my_store_products(): # Renamed function for clarity
    """Handles listing (GET) and adding (POST) products for the authenticated seller's store."""
    if request.method == 'GET':
        if not current_user.is_seller:
            return jsonify({"error": "You are not a seller."}), 403

        if not current_user.stores:
            return jsonify({"error": "No store found for this seller."}), 404
        
        store_id = current_user.stores[0].id
        products_data = get_products_by_store_id(store_id)
        return jsonify(products_data), 200

    elif request.method == 'POST':
        if not current_user.is_seller:
            return jsonify({"error": "You are not authorized to add products."}), 403
        
        if not current_user.stores:
            return jsonify({"error": "No store found for this seller to add products to."}), 404

        store_id = current_user.stores[0].id
        request_data = request.get_json()

        if not request_data:
            return jsonify({"error": "No input data provided"}), 400

        try:
            # The product_data for the service function is the entire request_data
            new_product_dict = add_product_to_store(store_id, request_data)
            return jsonify(new_product_dict), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            db.session.rollback() # Rollback in case of other DB errors
            print(f"Error adding product: {str(e)}") # Log for server
            return jsonify({"error": "An internal error occurred while adding the product."}), 500


@store_bp.route('/myproducts/<int:product_id>', methods=['PUT'])
@login_required
def update_my_store_product(product_id):
    """Updates a specific product in the authenticated seller's store."""
    if not current_user.is_seller:
        return jsonify({"error": "You are not authorized to update products."}), 403
    
    if not current_user.stores:
        return jsonify({"error": "No store found for this seller."}), 404

    user_store_id = current_user.stores[0].id
    request_data = request.get_json()

    if not request_data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        updated_product_dict = update_product_in_store(product_id, user_store_id, request_data)
        return jsonify(updated_product_dict), 200
    except ValueError as e:
        if "Product not found" in str(e):
            return jsonify({"error": str(e)}), 404
        else:
            return jsonify({"error": str(e)}), 400
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        db.session.rollback()
        print(f"Error updating product {product_id}: {str(e)}")
        return jsonify({"error": "An internal error occurred while updating the product."}), 500


@store_bp.route('/myproducts/<int:product_id>', methods=['DELETE'])
@login_required
def delete_my_store_product(product_id):
    """Deletes a specific product from the authenticated seller's store."""
    if not current_user.is_seller:
        return jsonify({"error": "You are not authorized to delete products."}), 403
    
    if not current_user.stores:
        return jsonify({"error": "No store found for this seller."}), 404

    user_store_id = current_user.stores[0].id

    try:
        delete_product_from_store(product_id, user_store_id)
        return jsonify({"message": "Product deleted successfully"}), 200
    except ValueError as e: # Catches product not found
        return jsonify({"error": str(e)}), 404
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting product {product_id}: {str(e)}")
        return jsonify({"error": "An internal error occurred while deleting the product."}), 500


@store_bp.route('/myorders', methods=['GET'])
@login_required
def list_my_store_orders():
    """Lists all orders for the currently authenticated seller's store."""
    if not current_user.is_seller:
        return jsonify({"error": "You are not a seller."}), 403

    if not current_user.stores:
        return jsonify({"error": "No store found for this seller."}), 404

    store_id = current_user.stores[0].id
    orders_data = get_orders_by_store_id(store_id)
    
    return jsonify(orders_data), 200
