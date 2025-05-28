import React, { useState } from 'react';

export default function CustomerContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { name: 'Ayaan Ahmed', email: 'ayaan@example.com', phone: '25261xxxxxx', joined: 'Jan 12, 2025' },
    { name: 'Nasteexo Ali', email: 'nasteexo@example.com', phone: '25261xxxxxx', joined: 'Feb 3, 2025' },
    { name: 'Cabdi Xasan', email: 'cabdi@example.com', phone: '25261xxxxxx', joined: 'Mar 21, 2025' },
    { name: 'Deeqa Maxamed', email: 'deeqa@example.com', phone: '25261xxxxxx', joined: 'Apr 10, 2025' },
  ];

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h2>

        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-md border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Table view for desktop */}
      <div className="hidden sm:block rounded-lg bg-white dark:bg-gray-800 shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-200">
            {filteredCustomers.map((customer, index) => (
              <tr key={index} className="border-t dark:border-gray-700">
                <td className="px-4 py-3">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">{customer.joined}</td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 dark:text-gray-500 px-4 py-6">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="sm:hidden space-y-4">
        {filteredCustomers.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 py-6">
            No customers found.
          </div>
        )}

        {filteredCustomers.map((customer, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">{customer.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{customer.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{customer.phone}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Joined: {customer.joined}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
