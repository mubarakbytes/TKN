import React, { useState } from 'react';
import {Pencil, Trash} from 'lucide-react';
export default function ProductContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const products = [
    { name: 'Wireless Mouse', category: 'Electronics', stock: 34, price: '$15.99' },
    { name: 'Running Shoes', category: 'Footwear', stock: 12, price: '$45.00' },
    { name: 'USB-C Cable', category: 'Electronics', stock: 50, price: '$9.99' },
    { name: 'Baseball Cap', category: 'Clothing', stock: 20, price: '$12.50' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto">
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-white w-full sm:w-1/2"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-white w-full sm:w-1/4"
        >
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-200">
            {filteredProducts.map((product, index) => (
              <tr key={index} className="border-t dark:border-gray-700">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3 space-x-4">
                  <Pencil className="inline-block mr-1 text-blue-600 dark:text-blue-400 cursor-pointer" 
                    onClick={() => alert('Edit clicked')}
                  />
                  <Trash className="inline-block mr-1 text-red-600 dark:text-red-400 cursor-pointer" 
                    onClick={() => alert('Delete clicked')}
                  />
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block sm:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{product.price}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Category: {product.category}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300">Stock: {product.stock}</p>


              <div className="flex gap-4 mt-2 justify-end">
                <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  <Pencil className="inline-block mr-1" 
                    onClick={() => alert('Edit clicked')}
                  />
                </button>
                <button className="text-red-600 dark:text-red-400 text-sm hover:underline">
                  <Trash className="inline-block mr-1" 
                    onClick={() => alert('Delete clicked')}
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
