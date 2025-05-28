import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardContent() {
  const recentOrders = [
    { id: '#1001', customer: 'Ayan A.', status: 'Pending', total: '$150.00' },
    { id: '#1000', customer: 'Hassan M.', status: 'Completed', total: '$99.99' },
  ];

  const salesData = [
    { name: 'Jan', sales: 1200 },
    { name: 'Feb', sales: 2100 },
    { name: 'Mar', sales: 800 },
    { name: 'Apr', sales: 1600 },
    { name: 'May', sales: 2400 },
    { name: 'Jun', sales: 1800 },
    { name: 'Jul', sales: 9000 },
    { name: 'Aug', sales: 3000 },
    { name: 'Sep', sales: 2200 },
    { name: 'Oct', sales: 2600 },
    { name: 'Nov', sales: 3200 },
    { name: 'Dec', sales: 4000 },
  ];

  return (
    <div className="space-y-8 w-full overflow-x-hidden">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome back 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h2 className="text-gray-600 dark:text-gray-300">Total Sales</h2>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">$12,340</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h2 className="text-gray-600 dark:text-gray-300">Products</h2>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">145</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h2 className="text-gray-600 dark:text-gray-300">Orders</h2>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">320</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h2 className="text-gray-600 dark:text-gray-300">Customers</h2>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">78</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Store Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#6C5CE7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Orders</h2>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 text-sm border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-100">{order.id}</td>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-100">{order.customer}</td>
                  <td className={`py-2 px-4 ${order.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}`}>{order.status}</td>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-100">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {recentOrders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-white">{order.id}</span>
                <span
                  className={`text-sm font-semibold ${
                    order.status === 'Pending'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Customer: {order.customer}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total: {order.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
