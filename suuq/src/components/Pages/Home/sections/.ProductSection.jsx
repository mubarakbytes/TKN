// src/components/sections/ProductSection.jsx
import React from 'react';
import ProductCard from './.ProductCard'; // Import ProductCard
import CategoryCard from './CategoryCard'; // Import CategoryCard

const ProductSection = ({ title, products, cardType, viewAllLink }) => { // Added cardType prop
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900  dark:bg-gray-800 dark:text-white mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"> {/* Responsive grid - adjust cols as needed */}
          {products && products.map((item) => ( // Renamed 'product' to 'item' to be more generic
            <div key={item.id}>
              {cardType === 'category' ? ( // Conditional rendering based on cardType
                <CategoryCard category={item} /> // Render CategoryCard if cardType is 'category'
              ) : (
                <ProductCard product={item} />   // Otherwise, render ProductCard (default is 'product' card)
              )}
            </div>
          ))}
        </div>

        {viewAllLink && (
          <div className="mt-4 text-right">
            <a href={viewAllLink} className="text-blue-500 hover:underline">View All</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;