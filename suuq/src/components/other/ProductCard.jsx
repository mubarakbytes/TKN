import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext'; // Import the hook

// Helper function to render stars (example)
const StarRating = ({ rated, rating }) => {
  console.log("This is value: ",rated);
  const totalStars = 5;
  const fullStars = Math.floor(rated);
  const halfStar = rated % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center justify-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
      {halfStar && <span key="half">☆</span>} {/* Simple half star representation */}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">☆</span>)}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({rated.toFixed(1)})</span>
    </div>
  );
};


function ProductCard({ product }) { // Accept the whole product object as a prop
  const { id, name, price, discount,imageUrl, inStock, rating, number_of_user_rating,availableColors, colorImages, description } = product;
  const { addToCart } = useCart(); // Get addToCart function from context

  // State for selected color and current image URL
  const initialColor = availableColors?.[0] || null;
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

  // Update image when selected color changes and colorImages mapping exists
  useEffect(() => {
    if (selectedColor && colorImages && colorImages[selectedColor]) {
      setCurrentImageUrl(colorImages[selectedColor]);
    } else {
      setCurrentImageUrl(imageUrl); // Fallback to default image
    }
  }, [selectedColor, colorImages, imageUrl]);

  const handleAddToCart = () => {
    if (inStock) {
       // Pass the essential product details and selected color
      addToCart({ id, name, price, imageUrl: currentImageUrl }, selectedColor);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  }

  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price - discount : price;
  const rated = number_of_user_rating > 0 ? rating / number_of_user_rating : 0;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden border border-gray-200 dark:border-gray-700 h-full"> {/* Added border, ensure full height */}
        {/* Top Section: Image, Stock, Rating */}

        <a href={`/Product-Details/${product.id}`}>
        <div className="flex-shrink-0"> {/* Prevent this section from shrinking */}
            {/* Stock Badge */}
            <div className="text-xs mb-2 flex justify-end">
                {inStock ? (
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full font-medium">In Stock</span>
                ) : (
                <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-0.5 rounded-full font-medium">Out of Stock</span>
                )}
            </div>

            {/* Fixed Size Image Container */}
            <div className="w-36 h-36 mx-auto mb-3 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 relative group">
                <img
                    src={currentImageUrl} // Use state for image URL
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Added subtle zoom on hover
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder-image.png";
                    }}
                />
            </div>

            {/* Rating */}
            {rated && <StarRating rated={rated} rating={rating} />}
        </div>
        </a>

        {/* Middle Section: Name, Color Swatches */}
        <div className="text-center mt-2 flex-grow"> {/* Allow this section to grow */}
            <h3 title={name} className="text-sm sm:text-base dark:text-white text-gray-800 mb-1 font-semibold truncate"> {/* Use truncate for long names */}
                {name}
            </h3>

             {/* Color Swatches */}
             {availableColors && availableColors.length > 1 && (
                <div className="flex justify-center space-x-1.5 my-2">
                    {availableColors.map((color) => (
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
            )}

            {/* Optional: Short Description */}
            {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{description}</p> */}
        </div>


        {/* Bottom Section: Price & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col items-center"> {/* Center price and button */}
            {hasDiscount && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1">
                    ${price.toFixed(2)}
                </p>
            )}
            <p className="text-base sm:text-lg dark:text-gray-300 text-gray-700 font-bold text-center mb-3">
                ${discountedPrice.toFixed(2)}
                {hasDiscount && (
                    <span className="text-xs text-red-500 dark:text-red-400 ml-1">
                        Save ${discount.toFixed(2)}
                    </span>
                )}
            </p>
            <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                }`}
            >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    </div>
  );
}

export default ProductCard;