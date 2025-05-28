import React, { useState } from 'react';

export default function OrderContent() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    { id: '#ORD1234', customer: 'Ayaan Ahmed', date: 'Apr 12, 2025', total: '$59.99', status: 'Delivered', items: ['Mouse', 'Keyboard'] },
    { id: '#ORD1235', customer: 'Nasteexo Ali', date: 'Apr 13, 2025', total: '$35.00', status: 'Pending', items: ['Phone Case'] },
    { id: '#ORD1236', customer: 'Cabdi Xasan', date: 'Apr 14, 2025', total: '$120.00', status: 'Canceled', items: ['Monitor'] },
    { id: '#ORD1237', customer: 'Deeqa Maxamed', date: 'Apr 15, 2025', total: '$75.50', status: 'Delivered', items: ['Shoes', 'Socks'] },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-md border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table for desktop */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow hidden sm:block">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-200">
            {filteredOrders.map((order, index) => (
              <tr
                key={index}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.date}</td>
                <td className="px-4 py-3">{order.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-400 dark:text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="sm:hidden space-y-4">
        {filteredOrders.map((order, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedOrder(order)}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow cursor-pointer"
          >
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-gray-700 dark:text-white">{order.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Customer:</strong> {order.customer}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Date:</strong> {order.date}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Total:</strong> {order.total}</p>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
            No orders found.
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Details</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Date:</strong> {selectedOrder.date}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Total:</strong> {selectedOrder.total}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Status:</strong> {selectedOrder.status}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Items:</strong></p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-2 justify-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
