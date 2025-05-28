import React from 'react'
import HeroBanner from './sections/HeroBanner';
import ShopInfo from './sections/ShopInfo';
import ProductGrid from './sections/ProductGrid';


function ProfileStore() {
  return (
    <div>
      <>
      <HeroBanner />
      <ShopInfo />
      <ProductGrid />
      </>
    </div>
  )
}

export default ProfileStore
