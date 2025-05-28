import React, { useEffect, useState } from 'react';
import ProductCard from '../../../other/ProductCard';
import { getProducts } from '../../../../data/products';

function ProductGrid() {
  const [products, setProducts] = useState([]); // Initial empty array

  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await getProducts(); // await the Promise
      setProducts(fetchedProducts);
    }

    loadProducts();
  }, []); // Run once when component mounts

  console.log(products); // Now products will be an Array after fetching

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5 bg-gray-100 dark:bg-gray-900 rounded-b-lg">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">Loading products...</p>
      )}
    </div>
  );
}

export default ProductGrid;
