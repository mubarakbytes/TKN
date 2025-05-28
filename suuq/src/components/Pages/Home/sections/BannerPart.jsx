import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const BannerPart = () => {
  const [imageList, setImageList] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch image list from public/images.json
    fetch("/images.json")
      .then(response => response.json())
      .then(data => {
        setImageList(data.images.map(img => `/bannerImages/${img}`)); // Prefix path
      })
      .catch(error => console.error("Error loading images:", error));
  }, []);

  useEffect(() => {
    if (imageList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % imageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [imageList]);

  if (imageList.length === 0) return <p>Loading images...</p>;

  return (
    <div className="relative bg-gray-50 py-4 overflow-hidden dark:bg-gray-900">
      <div className="container mx-auto px-4 relative">
        <img
          src={imageList[currentImageIndex]}
          alt={`Banner Slide ${currentImageIndex + 1}`}
          className="rounded-lg shadow-lg dark:shadow-gray-500/50 w-full"
        />

        {/* Navigation Buttons */}
        <button
          onClick={() => setCurrentImageIndex(prev => (prev - 1 + imageList.length) % imageList.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-gray-700 focus:outline-none "
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        
        <button
          onClick={() => setCurrentImageIndex(prev => (prev + 1) % imageList.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-gray-700 focus:outline-none"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2">
          {imageList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`rounded-full w-3 h-3 focus:outline-none ${
                index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerPart;
