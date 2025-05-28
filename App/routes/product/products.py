from flask import Blueprint, jsonify, request
from application.extensions import db
from . import product_bp

@product_bp.route('/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        # Placeholder data - this should be replaced with actual database queries
        return jsonify([
            {
                "id": "prod1",
                "name": "Stylish Sneakers",
                "price": 59.99,
                "discount": 0,
                "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmjaX4RbcmRXNuEAY12S5jmIC4KeZYhgPvpw&s",
                "inStock": True,
                "rating": 30,
                "number_of_user_rating": 10,
                "availableColors": ["#FFFFFF", "#000000", "#e53e3e"],
                "colorImages": {
                    "#FFFFFF": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmjaX4RbcmRXNuEAY12S5jmIC4KeZYhgPvpw&s",
                    "#000000": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpAQ4WXRgO2RSBZwzx6eUnSnHW8k-4KQIL-g&s",
                    "#e53e3e": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIpOZ1gEGuNVU-dGj-wWnTjbBM7VNdAElIJQ&s"
                },
                "description": "Comfortable and stylish sneakers for everyday use.",
                "store": {
                    "storeId": 0,
                    "storeName": "Sneaker Store",
                    "storeLocation": "New York, NY",
                    "storeRating": 478,
                    "verified": True,
                    "storeNumber_of_user_rating": 100,
                    "storeImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6kjfZfrOhOPR-kY7Wk3CWz__mAPCQQt9zxg&s",
                    "storeDescription": "Your go-to store for the latest sneaker trends.",
                    "storeContact": "+1-234-567-8900"
                }
            },
            {
                "id": "prod5",
                "name": "Wireless Headphones Example",
                "price": 45.50,
                "discount": 0,
                "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_nJv3cVgzPVJ_HlGoKlurNVPvtdlU-80b2g&s",
                "inStock": True,
                "rating": 34,
                "number_of_user_rating": 10,
                "description": "Over-ear headphones with noise cancellation.",
                "store": {
                    "storeId": 0,
                    "storeName": "Sneaker Store",
                    "storeLocation": "New York, NY",
                    "storeRating": 478,
                    "verified": True,
                    "storeNumber_of_user_rating": 100,
                    "storeImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6kjfZfrOhOPR-kY7Wk3CWz__mAPCQQt9zxg&s",
                    "storeDescription": "Your go-to store for the latest sneaker trends.",
                    "storeContact": "+1-234-567-8900"
                }
            }
        ])
