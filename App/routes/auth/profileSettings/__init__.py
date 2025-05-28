# This file makes the profileSettings directory a Python package
from flask import Blueprint

profile_settings_bp = Blueprint('profile_settings', __name__)

# Import routes
from .update_profile import update_profile_bp
from .update_password import update_password_bp
from .delete_account import delete_account_bp
from .create_store import create_store_bp

# Register blueprints
profile_settings_bp.register_blueprint(update_profile_bp)
profile_settings_bp.register_blueprint(update_password_bp)
profile_settings_bp.register_blueprint(delete_account_bp)
profile_settings_bp.register_blueprint(create_store_bp) 