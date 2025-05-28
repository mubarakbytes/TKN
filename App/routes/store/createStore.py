from flask import request, jsonify
from . import store_bp
from application.extensions import db
from DataBase.models import Store




@store_bp.route('/create-store')
def create_store():
    data = request.get_json()

    if not data:
        return jsonify({"message":"There is no data"})
    
