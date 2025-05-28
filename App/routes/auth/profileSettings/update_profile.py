from flask import Blueprint, jsonify, request, session
# Make sure you don't import current_user if you're not using Flask-Login
# from flask_login import current_user # <-- Remove this if not using Flask-Login
from DataBase.models import User, db
import base64

update_profile_bp = Blueprint('update_profile', __name__)

@update_profile_bp.route('/update-profile', methods=['POST','PUT'])
def update_profile():
    try:
        # --- CORRECTED AUTHENTICATION CHECK ---
        # Check if user_id is in the session
        if 'user_id' not in session:
            # If not in session, return Unauthorized
            return jsonify({'error': 'Unauthorized'}), 401

        # Get user from the database using the ID stored in the session
        user_id = session['user_id']
        user = User.query.get(user_id)

        # If user_id was in session but the user doesn't exist in the DB
        if not user:
            # Optionally clear the session if user not found
            session.pop('user_id', None)
            return jsonify({'error': 'User not found'}), 404
        # --- END CORRECTED AUTHENTICATION CHECK ---

        # Add debug logging
        # No need to check user.is_authenticated if not using Flask-Login
        print("User ID from session:", user.id)

        data = request.get_json()
        print("Received data:", data)

        # Get the fields to update
        full_name = data.get('full_name')
        username = data.get('username')
        email = data.get('email')
        profile_image_data_url = data.get('profile_image') # Renamed for clarity

        # Validate email uniqueness if changed
        if email and email != user.email:
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({'error': 'Email already in use'}), 400

        # Validate username uniqueness if changed
        if username and username != user.username:
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                return jsonify({'error': 'Username already taken'}), 400

        # Update user fields if provided
        if full_name:
            user.full_name = full_name
        if username:
            user.username = username
        if email:
            user.email = email
        if profile_image_data_url:
            # Remove the data URL prefix if present
            if profile_image_data_url.startswith('data:image'):
                profile_image_base64 = profile_image_data_url.split(',')[1]
            else:
                profile_image_base64 = profile_image_data_url # Assume it's just base64 if no prefix
            try:
                user.profile_image = base64.b64decode(profile_image_base64)
            except Exception as e:
                 print(f"Error decoding profile image base64: {str(e)}")
                 return jsonify({'error': 'Invalid profile image format'}), 400


        # Save changes to database
        db.session.commit()

        # Prepare profile image for response
        profile_image_base64 = None
        if user.profile_image:
            try:
                profile_image_base64 = base64.b64encode(user.profile_image).decode('utf-8')
            except Exception as e:
                # This shouldn't happen if decoding worked earlier, but good to be safe
                print(f"Error encoding profile image for response: {str(e)}")
                # Decide if you want to fail or just return without the image
                # For now, let's just print and continue without the image
                profile_image_base64 = None # Ensure it's None on error

        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'username': user.username,
                'email': user.email,
                # Prepend data URL prefix for client if needed
                'profile_image': f"data:image/png;base64,{profile_image_base64}" if profile_image_base64 else None,
                'is_admin': user.is_admin, # Make sure your User model has these attributes
                'is_seller': user.is_seller # Make sure your User model has these attributes
            }
        }), 200

    except Exception as e:
        print("Error in update_profile:", str(e))  # Add error logging
        db.session.rollback()
        return jsonify({'error': 'An internal error occurred: ' + str(e)}), 500