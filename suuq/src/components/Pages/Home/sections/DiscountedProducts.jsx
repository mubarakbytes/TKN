import React, { useState } from 'react';
import { Discountproducts } from '../../../../data/Discount';
import Popup from '../../../other/Popup';

const DiscountedProducts = ({ itemName = "Smartphones" }) => {
  // Filter discounted products
  const discountedProducts = Discountproducts.filter(product => product.discount < product.price);

  // Calculate discount percentage
  const calculateDiscountPercentage = (price, discount) => {
    const percentage = ((price - discount) / price) * 100;
    return Math.round(percentage);
  };

  // State to manage popup visibility
  const [isOpen, setIsOpen] = useState(false);

  // Function to render a single product card
  const renderProductCard = (product) => (
    
    <div key={product.id} className="relative rounded-lg shadow-md dark:shadow-gray-500/50 overflow-hidden flex-shrink-0 w-full md:w-70">
      {product.discount < product.price && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded">
          {calculateDiscountPercentage(product.price, product.discount)}% Off
        </div>
      )}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-contain bg-gray-100"
      />
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-700 dark:text-white" title={product.name}>{product.name}</h3>
        <div className="flex items-center mt-2">
          <span className="text-gray-500 line-through">${product.price}</span>
          <span className="ml-2 text-indigo-600 font-bold dark:text-yellow-400">${product.discount}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white py-8 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Grab the best deal on{' '}
            <span className="text-indigo-600 dark:text-yellow-400">{itemName}</span>
          </h2>
          <button
            className="text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none dark:text-yellow-400"
            onClick={() => setIsOpen(true)}
            aria-label="View all discounted products"
          >
            View All &gt;
          </button>
        </div>

        {/* Main Product List (Row Layout) */}
        <div className="overflow-x-auto">
          <div className="flex flex-row space-x-4 md:space-x-6 p-2">
            {discountedProducts.map((product) => renderProductCard(product))}
          </div>
        </div>
      </div>

      {/* Popup Component (Column Layout) */}
      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} title="All Discounted Products">
        
        <div className="overflow-y-auto  max-h-[80vh]">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 [overflow-x:hidden]">
           
            {discountedProducts.map((product) => renderProductCard(product))}
           
          </div>
        </div>
        
      </Popup>
    </div>
  );
};

export default DiscountedProducts;