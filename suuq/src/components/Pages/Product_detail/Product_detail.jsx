// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {getProducts} from "../../../data/products";
import { FiCheckCircle } from "react-icons/fi";

const ProductDetail = () => {
    // getProducts = getProducts();
    const { id } = useParams();
    console.log(id);

    if (id) {
    console.log("id getted")
    }else{
        console.log("id not get it")
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#141E30] to-[#243B55] text-white">
            
            <main className="container mx-auto px-4 py-8 flex-grow">
                <h2 className="text-2xl font-bold">404</h2>
            </main>
    
            </div>
        );
    }

    const product = getProducts.find((p) => p.id === id);
    console.log("this is product", product)

    // State for selected color and current image URL
    const initialColor = product.availableColors?.[0] || null;
    const [selectedColor, setSelectedColor] = useState(initialColor);
    const [currentImageUrl, setCurrentImageUrl] = useState(product.imageUrl);

 // Update image when selected color changes and colorImages mapping exists
  useEffect(() => {
    if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
      setCurrentImageUrl(product.colorImages[selectedColor]);
    } else {
      setCurrentImageUrl(imageUrl); // Fallback to default image
    }
  }, [selectedColor, product.colorImages, product.imageUrl]);


  const handleColorSelect = (color) => {
    console.log(color)
    setSelectedColor(color);
  }


  const renderStars = (rating) => {
    const avgRating = rating / (product.number_of_user_rating || 1);
    const rounded = Math.round(avgRating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`${i <= rounded ? "text-[#FFD700]" : "text-gray-500"} mr-1`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#141E30] to-[#243B55] text-white">
     
        <main className="container mx-auto px-4 py-8 flex-grow">
          <h2 className="text-2xl font-bold">Product not found</h2>
        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#141E30] to-[#243B55] text-white">
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={currentImageUrl}
              alt={name}
              className="w-full max-w-md h-auto object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            {/* Store/Seller Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={product.store.storeImageUrl}
                alt={product.store.storeName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{product.store.storeName}</p>
                <p className="text-xs text-gray-400">{product.store.storeLocation}</p>
              </div>
              <FiCheckCircle className="text-green-400 text-lg" title="Verified Seller" />
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Price and Discount */}
            <p className="text-xl mb-1 text-[#00ADB5]">
              ${product.discount > 0 ? (product.price - product.discount).toFixed(2) : product.price.toFixed(2)}
              {product.discount > 0 && (
                <span className="text-sm line-through ml-2 text-gray-400">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </p>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {renderStars(product.rating)}
              <span className="ml-2 text-gray-400 text-sm">
                ({(product.rating / product.number_of_user_rating).toFixed(1)})
              </span>
            </div>

            {/* Description */}
            <p className="mb-6 text-gray-200">{product.description}</p>

            {/* Colors */}
            {product.availableColors && (
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-400">Available Colors:</p>
                <div className="flex gap-2">
                  {product.availableColors.map((color, index) => (
                    <button
                        key={color}
                        title={color} // Show hex/name on hover
                        onClick={() => handleColorSelect(color)}
                        className={`w-5 h-5 rounded-full border-2 transition ${selectedColor === color ? 'border-blue-500 scale-110' : 'border-transparent hover:border-gray-400'}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button className="bg-[#00ADB5] hover:bg-[#007d85] px-4 py-2 rounded text-white font-semibold transition duration-200">
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Seller Extra Info */}
            <div className="mt-8 border-t pt-4 text-sm text-gray-300">
              <p><strong>Seller:</strong> {product.store.storeName}</p>
              <p><strong>Contact:</strong> {product.store.storeContact}</p>
              <p><strong>Rating:</strong> {(product.store.storeRating / product.store.storeNumber_of_user_rating).toFixed(1)}/5 ({product.store.storeNumber_of_user_rating} <span>reviews)</span></p>
              <p className="mt-2">{product.store.storeDescription}</p>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default ProductDetail;
