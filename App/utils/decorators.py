from functools import wraps
from flask import jsonify
from flask_login import current_user

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            # This should ideally be caught by login_required first
            return jsonify({"error": "Authentication required."}), 401
        
        # Check if the user is an admin or super_admin
        # The User model has 'is_admin'. SuperAdmin is a separate model.
        # For a more robust solution, a role-based system or checking instance type might be better.
        # Using getattr for flexibility, assuming current_user might not always be a User instance
        # (though with Flask-Login, it typically is after authentication).
        
        is_admin = getattr(current_user, 'is_admin', False)
        # For SuperAdmin, we'd need to know how it's identified if current_user can be a SuperAdmin instance.
        # If current_user is always from User model, and SuperAdmin is a separate table not directly
        # loaded into current_user by default Flask-Login user_loader, this check for is_super_admin
        # on current_user might not work as intended without custom user loading.
        # Assuming for now 'is_super_admin' attribute might exist or this is a placeholder for future role system.
        is_super_admin = getattr(current_user, 'is_super_admin', False) 

        if not (is_admin or is_super_admin):
            return jsonify({"error": "Administrator access required."}), 403
        return f(*args, **kwargs)
    return decorated_function
