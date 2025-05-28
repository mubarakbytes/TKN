from flask import jsonify, session, request
import requests
import base64
from DataBase.models import User
from . import auth_bp
import time

@auth_bp.route('/status', methods=['GET'])
def check_session():
    ip=request.remote_addr
    print(f"ip address: {ip}")




    # Check if the IP is lnott ocalhost or IPv6 loopback address
    if ip != '127.0.0.1' or ip != '::1':
        # Get ip information such country, city using http://ip-api.com/json/{ip}
        response = requests.get(f'http://ip-api.com/json/{ip}')
        response_json = response.json()
        country = response_json.get('country')
        city = response_json.get('city')


    print("Localhost IP detected, using default IP for testing.")
    country = "Local"
    city= "host"

    try:
        # Check if session exists and hasn't expired
        if 'user_id' not in session:
            return jsonify({'isLoggedIn': False}), 200

        # Check session expiry
        if 'expires_at' in session and session['expires_at'] < int(time.time()):
            session.clear()
            return jsonify({'isLoggedIn': False, 'message': 'Session expired'}), 401

        # Check IP binding if enabled
        if 'ip_address' in session and session['ip_address'] != ip:
            session.clear()
            return jsonify({'isLoggedIn': False, 'message': 'Session invalid'}), 401

        user = User.query.get(session['user_id'])
        if user:
            if not user.is_active or user.is_banned:
                session.clear()
                return jsonify({'isLoggedIn': False, 'message': 'Account status changed'}), 401

            profile_image_base64 = None
            if user.profile_image:
                try:
                    profile_image_base64 = base64.b64encode(user.profile_image).decode('utf-8')
                except Exception as e:
                    print(f"Error encoding profile image: {str(e)}")
                    # Continue without profile image if encoding fails

            return jsonify({
                'isLoggedIn': True,
                'user': {
                    "id": user.id,
                    "full_name": user.full_name,
                    "username": user.username,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone,
                    "country": country,
                    "city": city,
                    "is_admin": user.is_admin,
                    "is_seller": user.is_seller,
                    "profile_image": profile_image_base64
                }
            }), 200
        else:
            session.clear()
            return jsonify({'isLoggedIn': False, 'message': 'User not found'}), 404

    except Exception as e:
        print(f"Status check error: {str(e)}")
        # Don't expose internal errors to client
        return jsonify({'isLoggedIn': False, 'message': 'Error checking status'}), 500 