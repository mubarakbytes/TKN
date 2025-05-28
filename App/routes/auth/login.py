from flask import request, jsonify, session
from werkzeug.security import check_password_hash
from sqlalchemy import func, or_
import base64
from application.extensions import db
from DataBase.models import User
from . import auth_bp
from functools import wraps
import time
from datetime import datetime, timedelta
import re
from flask_login import login_user, current_user

# Simple in-memory rate limiting with IP and username tracking
login_attempts = {}
username_attempts = {}
MAX_ATTEMPTS = 50
WINDOW_SECONDS = 300  # 5 minutes
SUSPICIOUS_PATTERNS = [
    r'(?i)(union\s+select|select\s+.*\s+from|drop\s+table)',  # SQL injection
    r'<[^>]*script.*?>',  # XSS
    r'(?i)(admin|root|administrator)',  # Common admin usernames
]

def is_suspicious_input(text):
    if not text:
        return False
    return any(re.search(pattern, text) for pattern in SUSPICIOUS_PATTERNS)

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        ip = request.remote_addr
        current_time = time.time()
        
        # Clean up old entries
        login_attempts.update((k, v) for k, v in login_attempts.items() 
                            if v['timestamp'] > current_time - WINDOW_SECONDS)
        username_attempts.update((k, v) for k, v in username_attempts.items() 
                               if v['timestamp'] > current_time - WINDOW_SECONDS)
        
        # Check IP-based rate limit
        if ip in login_attempts:
            if login_attempts[ip]['attempts'] >= MAX_ATTEMPTS:
                return jsonify({
                    "message": "Too many login attempts. Please try again later.",
                    "retry_after": int(login_attempts[ip]['timestamp'] + WINDOW_SECONDS - current_time)
                }), 429
            login_attempts[ip]['attempts'] += 1
        else:
            login_attempts[ip] = {'attempts': 1, 'timestamp': current_time}
            
        # Get identifier from request for username-based rate limiting
        try:
            data = request.get_json()
            if data and 'identifier' in data:
                identifier = data['identifier'].strip().lower()
                if identifier in username_attempts:
                    if username_attempts[identifier]['attempts'] >= MAX_ATTEMPTS:
                        return jsonify({
                            "message": "Account temporarily locked. Please try again later.",
                            "retry_after": int(username_attempts[identifier]['timestamp'] + WINDOW_SECONDS - current_time)
                        }), 429
                    username_attempts[identifier]['attempts'] += 1
                else:
                    username_attempts[identifier] = {'attempts': 1, 'timestamp': current_time}
        except:
            pass  # Don't block the request if we can't parse the identifier
        
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/login', methods=['POST'])
@rate_limit
def login():
    session.clear()  # Clear any existing session
    # Log login attempt time
    attempt_time = datetime.utcnow()
    
    # Validate Content-Type
    if not request.is_json:
        return jsonify({"message": "Content-Type must be application/json"}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    identifier = data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({"message": "Missing username/email or password"}), 400

    # Check for suspicious input patterns
    if is_suspicious_input(identifier):
        print(f"Suspicious login attempt detected from IP {request.remote_addr} with identifier: {identifier}")
        return jsonify({"message": "Invalid username/email or password"}), 401

    # Trim whitespace and convert to lowercase for case-insensitive comparison
    identifier = identifier.strip().lower()
    
    try:
        user = User.query.filter(or_(
            func.lower(User.username) == identifier,
            func.lower(User.email) == identifier
        )).first()

        # Use constant time comparison for password check
        if user and check_password_hash(user.password, password):
            if not user.is_active:
                print(f"Login attempt for inactive account: {identifier} at {attempt_time}")
                return jsonify({"message": "Account is inactive"}), 401

            if user.is_banned:
                print(f"Login attempt for banned account: {identifier} at {attempt_time}")
                return jsonify({"message": "Account is banned"}), 403
            
            if user.is_deleted:
                print(f"login attemp for deleted account: {identifier} at {attempt_time}")
                return jsonify({"message":"Account is deleted"}), 401

            # Clear rate limiting on successful login
            if request.remote_addr in login_attempts:
                del login_attempts[request.remote_addr]
            if identifier in username_attempts:
                del username_attempts[identifier]

            # Log the user in with Flask-Login
            login_user(user)

            # Set session with additional security measures
            
            session['user_id'] = user.id
            session['username'] = user.username
            session['created_at'] = int(time.time())
            session['expires_at'] = int(time.time()) + 24 * 60 * 60  # 24 hour expiry
            session['ip_address'] = request.remote_addr  # For IP binding
            
            # Update last login timestamp
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            profile_image_base64 = None
            if user.profile_image:
                profile_image_base64 = base64.b64encode(user.profile_image).decode('utf-8')

            print(f"Successful login for user: {user.username} at {attempt_time}")
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "full_name": user.full_name,
                    "email": user.email,
                    "is_admin": user.is_admin,
                    "is_seller": user.is_seller,
                    "profile_image": profile_image_base64,
                    "last_login": user.last_login.isoformat() if user.last_login else None
                }
            }), 200
        else:
            print(f"Failed login attempt for: {identifier} at {attempt_time}")
            return jsonify({"message": "Invalid username/email or password"}), 401

    except Exception as e:
        print(f"Login error: {str(e)} at {attempt_time}")
        return jsonify({"message": "An error occurred during login"}), 500

