import React, { useState } from 'react';
import dailyEssentialsData from '../../../../data/DailyEssential'
import Popup from '../../../other/Popup';


const DailyEssentials = () => {
  const [isOpenDailyEssential, setIsOpenDailyEssential] = useState(false);
  
  return (
    <div className="bg-white py-8 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Daily <span className="text-indigo-600 dark:text-yellow-400">Essentials</span>
          </h2>


          <button className="text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none dark:text-yellow-400"
          onClick={() =>setIsOpenDailyEssential(true)}
          >
            View All &gt;
          </button>


        </div>
        <div className="overflow-x-auto">
          <div className="flex flex-row space-x-4 md:space-x-6 p-2">
            {dailyEssentialsData.map((item, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md p-4 hover:shadow-lg dark:shadow-gray-500/50 transition duration-300 flex-shrink-0 w-48 md:w-64"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-md bg-gray-100"
                />
                <h3 className="text-md font-semibold text-gray-700 mt-2 truncate dark:text-white">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>




      <Popup isOpen={isOpenDailyEssential} onClose={() => setIsOpenDailyEssential(false)} title="Daily Essentials">
        
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center items-center grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 [overflow-x:hidden]">
           
            {dailyEssentialsData.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-md p-4 hover:shadow-lg dark:shadow-gray-500/50 transition duration-300 flex-shrink-0 w-48 md:w-64"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md bg-gray-100"
                  />
                  <h3 className="text-md font-semibold text-gray-700 mt-2 truncate dark:text-white">{item.name}</h3>
                </div>
              ))}
           
          </div>
        </div>
        
      </Popup>
    </div>
  );
};

export default DailyEssentials;