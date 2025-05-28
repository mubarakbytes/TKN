from flask import Blueprint, request, jsonify, session
from flask_login import login_required, current_user
from DataBase.models import db, Store
from utils.image_utils import save_image

create_store_bp = Blueprint('create_store', __name__, url_prefix='/create-store')

@create_store_bp.route('', methods=['POST'])
@login_required
def create_store():
    try:
        # Add debug logging
        print("Session data:", dict(session))
        print("Current user authenticated:", current_user.is_authenticated if hasattr(current_user, 'is_authenticated') else False)
        print("Current user:", current_user.id if hasattr(current_user, 'id') else None)
        
        data = request.get_json()
        print("Received data:", data)
        
        # Check if user can create a store
        if not current_user.can_create_store:
            print("User cannot create store - can_create_store is False")
            return jsonify({'error': 'You are not allowed to create a store'}), 403
            
        # Check if user already has a store
        if current_user.is_seller:
            print("User already has a store - is_seller is True")
            return jsonify({'error': 'You already have a store'}), 400
            
        # Validate required fields
        required_fields = ['store_name', 'store_description', 'store_location', 'store_category']
        for field in required_fields:
            if not data.get(field):
                print(f"Missing required field: {field}")
                return jsonify({'error': f'{field} is required'}), 400

        # Create new store
        store = Store(
            name=data['store_name'],
            description=data['store_description'],
            location=data['store_location'],
            category=data['store_category'],
            owner_id=current_user.id
        )

        # Handle store image if provided
        if 'store_image' in data and data['store_image']:
            try:
                image_data = save_image(data['store_image'])
                store.image = image_data
            except Exception as e:
                print(f"Error saving store image: {str(e)}")
                return jsonify({'error': f'Failed to save store image: {str(e)}'}), 400

        # Update user's seller status
        current_user.is_seller = True
        
        # Save to database
        db.session.add(store)
        db.session.commit()
        print("Store created successfully")

        # Return success response with store and updated user data
        return jsonify({
            'message': 'Store created successfully',
            'store': {
                'id': store.id,
                'name': store.name,
                'description': store.description,
                'location': store.location,
                'category': store.category
            },
            'user': {
                'id': current_user.id,
                'is_seller': current_user.is_seller,
                'username': current_user.username,
                'email': current_user.email,
                'full_name': current_user.full_name
            }
        }), 201

    except Exception as e:
        print(f"Error in create_store: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Failed to create store: {str(e)}'}), 500 