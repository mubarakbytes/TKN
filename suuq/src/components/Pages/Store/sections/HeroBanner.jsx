// HeroBanner.jsx

import React, { useState, useEffect } from 'react';

const bannerImageUrls = ['/bannerImages/mobile.png', '/bannerImages/laptop.png'];

function HeroBanner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImageUrls.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full">
      <img
        src={bannerImageUrls[currentImageIndex]}
        alt="Hero Banner"
        className="w-full h-auto object-contain"  // Ensures full visibility and responsiveness
      />
    </div>
  );
}

export default HeroBanner;
