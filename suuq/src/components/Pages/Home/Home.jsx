import React from 'react'
import DiscountedProducts from './sections/DiscountedProducts';
import BannerPart from './sections/BannerPart';
import TopCategories from './sections/TopCategories';
import TopBrands from './sections/TopBrands';
import DailyEssentials from './sections/DailyEssentials';




const  Home = () => {


  return (
    <div>     
        <BannerPart />
        <DiscountedProducts />
        <TopCategories />
        <TopBrands />
        <DailyEssentials />
    </div>
  )
}

export default Home;
