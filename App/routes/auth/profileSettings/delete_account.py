from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user, logout_user
from DataBase.models import User, Store, db
from werkzeug.security import check_password_hash

delete_account_bp = Blueprint('delete_account', __name__)

@delete_account_bp.route('/delete-account', methods=['POST'])
@login_required
def delete_account():
    try:
        data = request.get_json()
        password = data.get('password')
        
        # Validate password
        if not check_password_hash(current_user.password, password):
            return jsonify({'error': 'Password is incorrect'}), 400
        
        # Delete user's store if they have one
        store = Store.query.filter_by(owner_id=current_user.id).first()
        if store:
            db.session.delete(store)
        
        # Delete the user
        db.session.delete(current_user)
        db.session.commit()
        
        # Log the user out
        logout_user()
        
        return jsonify({'message': 'Account deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 