// src/components/sections/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden"> {/* Card container with styling */}
      <div className="aspect-w-4 aspect-h-3"> {/* Aspect ratio container for image - adjust ratio if needed */}
        <img
          className="object-cover w-full h-full"
          src={product.imageUrl} // Use product image URL from props
          alt={product.name}      // Use product name for alt text
        />
      </div>
      <div className="p-4"> {/* Padding for text content inside card */}
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate"> {/* Product Name */}
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between"> {/* Price and discount container */}
          <div>
            {product.discountPrice && ( // Conditional rendering for discount price
              <span className="text-red-600 font-semibold text-sm mr-2 line-through dark:text-red-400"> {/* Original price with strikethrough */}
                ${product.price}
              </span>
            )}
            <span className="text-gray-900 font-bold text-sm dark:text-white"> {/* Current price */}
              ${product.discountPrice || product.price}
            </span>
          </div>
          {/* Placeholder for "REEW" - You can customize this based on your data */}
          {product.isReew && (
            <span className="text-xs text-blue-500 font-semibold uppercase">REEW</span>
          )}
        </div>
        {/* Placeholders for "Cover OFF" and "BOL OFF" - Customize as needed */}
        <div className="mt-2 flex space-x-2 text-xs text-gray-600 dark:text-gray-400">
          {product.coverOff && <span>Cover OFF</span>}
          {product.bolOff && <span>BOL OFF</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;