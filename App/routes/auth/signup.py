"""Handles new user registration process."""
from flask import request, jsonify
from werkzeug.security import generate_password_hash
from sqlalchemy import or_
import re
import base64 # Import the base64 module
from application.extensions import db
from DataBase.models import User
from flask_login import login_user
from . import auth_bp  # Import the existing blueprint

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Registers a new user with the provided details."""
    try:
        data = request.get_json()

        # Get user details
        full_name = data.get('full_name')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        profile_image_b64 = data.get('profile_image') # Rename to indicate it's base64

        # Validate required fields
        if not all([full_name, username, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already taken'}), 400

        # Create new user
        user = User(
            full_name=full_name,
            username=username,
            email=email,
            password=generate_password_hash(password), # generate_password_hash returns string
            is_admin=False,
            is_seller=False
        )

        # Process profile image if provided
        if profile_image_b64:
            # Safe to proceed only if it's a string
            if isinstance(profile_image_b64, str):
                if profile_image_b64.startswith('data:image'):
                    profile_image_b64 = profile_image_b64.split(',')[1]
                try:
                    user.profile_image = base64.b64decode(profile_image_b64)
                except Exception as e:
                    return jsonify({'error': f'Invalid profile image data: {e}'}), 400
            else:
                return jsonify({'error': 'Profile image must be a base64-encoded string'}), 400



        # Save user to database
        db.session.add(user)
        db.session.commit()

        # Log the user in (optional, depending on your flow)
        login_user(user)

        # Note: When returning the user object, you might need to re-encode
        # the profile_image bytes back to base64 if the frontend expects it that way.
        # For simplicity here, I'm not including the image bytes in the response JSON.
        # If you need it, add: 'profile_image': base64.b64encode(user.profile_image).decode('utf-8') if user.profile_image else None
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'username': user.username,
                'email': user.email,
                'profile_image': base64.b64encode(user.profile_image).decode('utf-8') if user.profile_image else None,
                'is_admin': user.is_admin,
                'is_seller': user.is_seller
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        # Log the full exception for debugging on the server side
        print(f"Error during signup: {e}") 
        return jsonify({'error': 'An internal server error occurred'}), 500 # Provide a generic error to the client
