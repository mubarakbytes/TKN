# This file makes the auth directory a Python package 

from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

# Import all routes
from .login import *
from .logout import *
from .signup import *
from .status import *
from .profileSettings import profile_settings_bp

# Register profile settings blueprint
auth_bp.register_blueprint(profile_settings_bp, url_prefix='/profile') 