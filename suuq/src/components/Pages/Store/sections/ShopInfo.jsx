import React from 'react';
// Make sure you have an icon image in public/images or src/assets
import shopIcon from '/public/shoplogo.png'; // Adjust path as needed

function ShopInfo() {
  return (
    <div className="flex dark:bg-gray-800 flex-col items-center py-6 px-5 bg-white relative"> {/* Added relative for z-index context */}
      <div className="bg-white dark:bg-gray-700 dark:shadow-gray-500/50 rounded-full p-3 sm:p-4 shadow-lg mb-4 relative z-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mt-[-32px] sm:mt-[-40px]"> {/* Adjust negative margin for overlap */}
        <img
          src={shopIcon}
          alt="Shop Icon"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
      </div>
      <h1 className="text-xl dark:text-white sm:text-2xl text-gray-800 font-semibold m-0">
        Magaca Tukaanka
      </h1>
    </div>
  );
}

export default ShopInfo;