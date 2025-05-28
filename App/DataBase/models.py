from sqlalchemy.sql import func
from application.extensions import db
from flask_login import UserMixin

# Admin Model
class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    can_delete_users = db.Column(db.Boolean, default=False)
    can_ban_users = db.Column(db.Boolean, default=False)
    can_delete_products = db.Column(db.Boolean, default=False)
    can_ban_products = db.Column(db.Boolean, default=False)
    can_delete_stores = db.Column(db.Boolean, default=False)
    can_ban_stores = db.Column(db.Boolean, default=False)
    can_add_categories = db.Column(db.Boolean, default=False)
    can_delete_categories = db.Column(db.Boolean, default=False)
    can_edit_categories = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Admin {self.username}>"


# SuperAdmin Model
class SuperAdmin(db.Model):
    __tablename__ = 'super_admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"<SuperAdmin {self.username}>"


# User Model (Buyers & Sellers)
class User(UserMixin, db.Model):
    '''artbutes:
    - full_name -> Required
    - username -> Required
    - password -> Required
    - email -> Required
    - phone -> Not Required
    - address -> Not Required
    - city -> Not Required
    - state -> Not Required
    - country -> Not Required
    - profile_image -> Not Required
    - is_admin -> default False
    - is_verified -> default False
    - is_active -> default True
    - is_seller -> default False
    - is_buyer -> default True
    - is_banned -> default False
    - is_store -> default False
    - is_deleted -> default False
    '''
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password = db.Column(db.String(500), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(15), unique=True, nullable=True)
    address = db.Column(db.String(200), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    profile_image = db.Column(db.LargeBinary, nullable=True)
    can_create_store = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    is_seller = db.Column(db.Boolean, default=False)
    is_buyer = db.Column(db.Boolean, default=True)
    is_banned = db.Column(db.Boolean, default=False)
    is_store = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    last_login = db.Column(db.DateTime(timezone=True), nullable=True)

    carts = db.relationship('Cart', backref='user', cascade="all, delete", lazy=True)
    orders = db.relationship('Order', backref='user', cascade="all, delete", lazy=True)
    wishlists = db.relationship('Wishlist', backref='user', cascade="all, delete", lazy=True)
    stores = db.relationship('Store', backref='owner', cascade="all, delete", lazy=True)
    store_employees = db.relationship('StoreEmployee', backref='user', cascade="all, delete", lazy=True)
    logs = db.relationship('Logs', backref='user', cascade="all, delete", lazy=True)
    search_queries = db.relationship('SearchQuery', backref='user', cascade="all, delete", lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"

    def get_id(self):
        return str(self.id)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False


class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Pending')  # Pending, Shipped, Delivered, Cancelled
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    
    order_items = db.relationship('OrderItem', backref='order', lazy=True)


class OrderItem(db.Model):
    __tablename__ = 'order_item'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Float, nullable=False)  # Price per item at the time of purchase

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    product = db.relationship('Product', backref='order_items')

    def subtotal(self):
        return self.quantity * self.price


# Cart Model
class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete="CASCADE"), nullable=False)
    quantity = db.Column(db.Integer, default=1)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    product = db.relationship('Product', backref='carts', lazy=True)

    def __repr__(self):
        return f"<Cart {self.id}>"



class Wishlist(db.Model):
    '''id = db.Column(db.Integer, primary_key=True)
        
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        
        product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
        
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

        product = db.relationship('Product', backref='wishlists')'''
    __tablename__ = 'wishlist'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    product = db.relationship('Product', backref='wishlists')


# Store Model
class Store(db.Model):
    '''
    id = primary_key=True

    name = String(100), nullable=False, unique=True

    storeUsername = String(80), unique=True, nullable=False

    description = String(200), nullable=True

    location = String(200), nullable=False

    is_verified = Boolean, default=False

    is_active = Boolean, default=True

    is_banned = Boolean, default=False

    number_warned = Integer, default=0

    store_banner = LargeBinary, nullable=True

    store_logo = LargeBinary, nullable=False

    store_rating = Float, default=0.0

    store_reviews = Integer, default=0

    store_followers = Integer, default=0

    owner_id = Integer, db.ForeignKey('user.id'

    created_at = DateTime(timezone=True), server_default=func.now())

    updated_at = DateTime(timezone=True), onupdate=func.now())

    products = db.relationship('Product', backref='store', cascade="all, delete", lazy=True)
    employees = db.relationship('StoreEmployee', backref='store', cascade="all, delete", lazy=True)
    blacklists = db.relationship('Blacklist', backref='store', cascade="all, delete", lazy=True)
    '''
    __tablename__ = 'store'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    storeUsername = db.Column(db.String(80), unique=True, nullable=False)
    storePassword = db.Column(db.String(100))
    description = db.Column(db.String(200), nullable=True)
    location = db.Column(db.String(200), nullable=False)

    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    is_banned = db.Column(db.Boolean, default=False)
    number_warned = db.Column(db.Integer, default=0)

    
    store_banner = db.Column(db.LargeBinary, nullable=True)
    store_logo = db.Column(db.LargeBinary, nullable=False)
    store_rating = db.Column(db.Float, default=0.0)
    store_reviews = db.Column(db.Integer, default=0)
    store_followers = db.Column(db.Integer, default=0)

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    products = db.relationship('Product', backref='store', cascade="all, delete", lazy=True)
    employees = db.relationship('StoreEmployee', backref='store', cascade="all, delete", lazy=True)
    blacklists = db.relationship('Blacklist', backref='store', cascade="all, delete", lazy=True)

    def __repr__(self):
        return f"<Store {self.name}>"


# StoreEmployee Model
class StoreEmployee(db.Model):
    __tablename__ = 'store_employee'
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id', ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    roles = db.relationship('StoreEmployeeRole', backref='store_employee', cascade="all, delete", lazy=True)

    def __repr__(self):
        return f"<StoreEmployee {self.id}>"


# StoreEmployeeRole Model
class StoreEmployeeRole(db.Model):
    __tablename__ = 'store_employee_role'
    id = db.Column(db.Integer, primary_key=True)
    store_employee_id = db.Column(db.Integer, db.ForeignKey('store_employee.id', ondelete="CASCADE"), nullable=False)

    is_admin = db.Column(db.Boolean, default=False)
    is_manager = db.Column(db.Boolean, default=False)
    is_sales = db.Column(db.Boolean, default=False)
    is_inventory = db.Column(db.Boolean, default=False)
    is_customer_service = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<StoreEmployeeRole {self.id}>"


# Logs Model
class Logs(db.Model):
    __tablename__ = 'logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    action = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Log {self.id}>"


# Blacklist Model
class Blacklist(db.Model):
    __tablename__ = 'blacklist'
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id', ondelete="CASCADE"), nullable=False)
    reason = db.Column(db.String(200), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Blacklist {self.id}>"


# Product Model
class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    discount = db.Column(db.Float, default=0.0)
    available_colors = db.Column(db.String(200), nullable=True)
    available_sizes = db.Column(db.String(200), nullable=True)
    condition = db.Column(db.String(50), nullable=False)  # New, Used, Refurbished
    in_stock = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Float, default=0.0)
    number_of_user_rating = db.Column(db.Integer, default=0)
    number_of_sales = db.Column(db.Integer, default=0)
    stock_quantity = db.Column(db.Integer, nullable=False)

    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    is_banned = db.Column(db.Boolean, default=False)

    category_id = db.Column(db.Integer, db.ForeignKey('category.id', ondelete="SET NULL"), nullable=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id', ondelete="CASCADE"), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Product {self.name}>"


# Category Model
class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(200), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    products = db.relationship('Product', backref='category', lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"


# SearchQuery Model
class SearchQuery(db.Model):
    __tablename__ = 'search_query'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    query = db.Column(db.String(255), nullable=False)
    search_date = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<SearchQuery {self.query}>"

