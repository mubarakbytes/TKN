import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './sections/sidebar';
import DashboardContent from './content/Dashboard';
import ProductContent from './content/Products';
import OrdersContent from './content/Orders';
import CustomersContent from './content/Customers';
import ReportContent from './content/Report';
import ProfileContent from './content/Settings';

function Dashboard() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-grow p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {path === '/dashboard' || path === '/dashboard/' ? (
          <DashboardContent />
        ) : null}

        {path.includes('/dashboard/Products') ? (
          <ProductContent />
        ) : null}


        {path.includes('/dashboard/Orders') ? (
          <OrdersContent />
        ) : null}

        {path.includes('/dashboard/Customers') ? (
          <CustomersContent />
        ) : null}


        {path.includes('/dashboard/Reports') ? (
          <div className="flex justify-center items-center h-full">
            <ReportContent />
          </div>
        ) : null}

        {path.includes('/dashboard/setting') ? (
          <div className="flex justify-center items-center h-full">
            <ProfileContent />
          </div>
        ) : null}


      </main>
    </div>
  );
}

export default Dashboard;
