# app.py
from flask import Flask, session
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
import os

# Import Config
from config import Config

# Import db and cors from extensions.py
from application.extensions import db, cors

# Import blueprints from routes package
from routes import blueprints

# Import User model
from DataBase.models import User

# Create Flask app instance
app = Flask(__name__)

# Load configuration from config.py
app.config.from_object(Config)

migrate = Migrate(app, db)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Initialize SQLAlchemy
db.init_app(app)

# Initialize CORS after db.init_app(app)
# The resources dictionary will be used from the original configuration
cors_resources = {
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-CSRF-Token", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
    }
}
cors.init_app(app, resources=cors_resources, supports_credentials=True)

# Register all blueprints
for blueprint, url_prefix in blueprints:
    app.register_blueprint(blueprint, url_prefix=url_prefix)
    print(f"Full route => {url_prefix}/{blueprint.name}")

if __name__ == "__main__":
    with app.app_context():
        # db.drop_all()  # Commented out to prevent accidental data loss
        db.create_all()
        print("Tables checked/created.")
    app.run(host="0.0.0.0", port=5000, debug=True)
