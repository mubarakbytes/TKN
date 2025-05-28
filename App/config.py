"""Loads and provides configuration settings for the Flask application."""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration class. Attributes are loaded from environment variables or defaults."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///default.db')
    SESSION_COOKIE_SAMESITE = os.getenv('SESSION_COOKIE_SAMESITE', 'Lax')
    SESSION_COOKIE_NAME = os.getenv('SESSION_COOKIE_NAME', 'session')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # Default 16MB
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_recycle': 280}
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() in ('true', '1', 't')
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'True').lower() in ('true', '1', 't')
    SESSION_COOKIE_HTTPONLY = os.getenv('SESSION_COOKIE_HTTPONLY', 'True').lower() in ('true', '1', 't')
    PERMANENT_SESSION_LIFETIME = int(os.getenv('PERMANENT_SESSION_LIFETIME', 2592000))  # Default 30 days
    SESSION_REFRESH_EACH_REQUEST = os.getenv('SESSION_REFRESH_EACH_REQUEST', 'True').lower() in ('true', '1', 't')
