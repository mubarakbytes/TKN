import React, { useState } from 'react';
import { topBrandsData } from '../../../../data/brands'
import Popup from '../../../other/Popup';


const TopBrands = ({ categoryName = "Electronics" }) => {
  const [isOpenBrand, setIsOpenBrand] = useState(false);
  
  return (
    <div className="bg-white py-8 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Top <span className="text-indigo-600 dark:text-yellow-400">{categoryName}</span> Brands
          </h2>
          <button className="text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none dark:text-yellow-400"
          onClick={() => setIsOpenBrand(true)}
          
          >
            View All &gt;
            
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex flex-row space-x-4 md:space-x-6 p-2">
            {topBrandsData.map((brand, index) => (
              <div
                key={index}
                className="relative rounded-lg shadow-md p-4 hover:shadow-lg dark:shadow-gray-500/50 transition duration-300 flex-shrink-0 w-[400px] md:w-[400px] h-[200px] flex items-center justify-center"
              >
                <img
                // image needed 400x200
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
                {brand.discountOffer && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs font-semibold py-1 px-2 rounded">
                    {brand.discountOffer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>


      <Popup isOpen={isOpenBrand} onClose={() => setIsOpenBrand(false)} title={`Top ${categoryName} Brands`}>
        
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center items-center grid gap-8 md:grid-cols-2 lg:grid-cols-3 [overflow-x:hidden]">
           
            {topBrandsData.map((brand, index) => (
                <div
                  key={index}
                  className="relative rounded-lg shadow-md p-4 hover:shadow-lg dark:shadow-gray-500/50 transition duration-300 flex-shrink-0 w-[400px] md:w-[400px] h-[200px] flex items-center justify-center"
                >
                  <img
                  // image needed 400x200
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                  {brand.discountOffer && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs font-semibold py-1 px-2 rounded">
                      {brand.discountOffer}
                    </div>
                  )}
                </div>
            ))}
           
          </div>
        </div>
        
      </Popup>
    </div>
  );
};

export default TopBrands;