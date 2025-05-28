from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from DataBase.models import User, db
from werkzeug.security import check_password_hash, generate_password_hash

update_password_bp = Blueprint('update_password', __name__)

@update_password_bp.route('/update-password', methods=['POST'])
@login_required
def update_password():
    try:
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        # Validate current password
        if not check_password_hash(current_user.password, current_password):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Update password
        current_user.password = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 