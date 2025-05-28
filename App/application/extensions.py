"""Initializes and exports Flask extensions used across the application, such as SQLAlchemy and CORS."""
# extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()
cors = CORS()
