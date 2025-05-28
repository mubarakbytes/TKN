import React, { useState } from 'react';
import categoriesData from '../../../../data/categories'
import Popup from '../../../other/Popup';


// You might want to store this data in a separate file (e.g., src/data/categories.js)


const TopCategories = () => {
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  
  return (
    <div className="bg-white py-8 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Shop From Top<span className="text-indigo-600 dark:text-yellow-400"> Categories</span>
          </h2>
          <button className="text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none dark:text-yellow-400"
          onClick={() => setIsOpenCategory(true)}
          >
            View All &gt;
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex flex-row space-x-4 md:space-x-6 p-2">
            {categoriesData.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-lg shadow-md p-4 hover:shadow-lg dark:shadow-gray-500/50 transition duration-300 flex-shrink-0 w-32 md:w-40"
              >
                <div
                  className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-gray-100"
                  style={{
                    backgroundImage: `url(${category.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* No need for the <img> tag here */}
                </div>
                <p className="text-sm font-medium text-gray-700 text-center whitespace-nowrap dark:text-gray-100">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <Popup isOpen={isOpenCategory} onClose={() => setIsOpenCategory(false)} title="Top Categories">
        <div className="overflow-y-auto max-h-[80vh] px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoriesData.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-lg shadow-md p-4 hover:shadow-lg dark:shadow-gray-500/50 transition duration-300 w-32 md:w-40"
                
              >
                <div
                  className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-gray-100"
                  style={{
                    backgroundImage: `url(${category.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <p className="text-sm font-medium text-gray-700 text-center whitespace-nowrap dark:text-gray-100">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Popup>


    </div>
  );
};

export default TopCategories;