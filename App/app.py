# app.py
from flask import Flask, session
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Import db from extensions.py
from application.extensions import db

# Import blueprints from routes package
from routes import blueprints

# Import User model
from DataBase.models import User

# Create Flask app instance
app = Flask(__name__)
migrate = Migrate(app, db)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Configure app
app.secret_key = os.getenv("SECRET_KEY", "fallback-secret-key")  # Use env or fallback
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_NAME"] = "session"
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "connect_args": {"connect_timeout": 30},
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Enhanced session security
is_production = os.environ.get("FLASK_ENV") == "production"
app.config["SESSION_COOKIE_SECURE"] = is_production  # True in prod, False in dev
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = 24 * 60 * 60  # 24h
app.config["SESSION_REFRESH_EACH_REQUEST"] = True

# Initialize CORS
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "X-CSRF-Token", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    },
    supports_credentials=True,
)

# Initialize SQLAlchemy
db.init_app(app)

# Register all blueprints
for blueprint, url_prefix in blueprints:
    app.register_blueprint(blueprint, url_prefix=url_prefix)
    print(f"Full route => {url_prefix}/{blueprint.name}")

if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Tables checked/created.")
    app.run(host="0.0.0.0", port=5000, debug=True)
