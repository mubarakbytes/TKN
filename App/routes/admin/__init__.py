from flask import Blueprint

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

from . import store_requests # Import to register routes
from . import stores_management # Import to register store management routes
