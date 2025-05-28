// src/components/header/MobileNavMenu.jsx

import { MapPinIcon, TruckIcon, TagIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const MobileNavMenu = () => {
  const [thedata, setThedata] = useState(null);
  const [dashboard, setDashboard] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Error fetching auth status:', response.statusText);
          return;
        }

        const data = await response.json();
        if (data.user.is_seller) {
          setDashboard(true);
        }
        setThedata(data);
      } catch (error) {
        console.error('Request failed:', error);
      }
    };

    // ⏱️ Wait 1- seconds before running checkAuth

    checkAuth();


    // Cleanup timeout if component unmounts early
    // return () => clearTimeout(timer);

  }, []);

  console.log('Mobile ', thedata);
  return (
    <div className="h-full w-64 bg-white p-4 dark:text-white dark:bg-gray-800">
      <div className="mb-4 text-base font-medium text-gray-800 dark:text-white">
        Welcome to Worldwide Tukaanmeysi!
      </div>
      
      <div className="flex flex-col space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-300">
          <MapPinIcon className="h-5 w-5 text-blue-500 dark:text-white" />
          <span>Deliver to {thedata?.user?.country}, {thedata?.user?.city}</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-300">
          <TruckIcon className="h-5 w-5 text-blue-500 dark:text-white" />
          <span>Track your order</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-300">
          <TagIcon className="h-5 w-5 text-blue-500 dark:text-white" />
          <span>All Offers</span>
        </a>

        {/* 🧭 NEW: Dashboard */}
        {dashboard && (
          <a href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-300">
            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-blue-500 dark:text-white" />
            <span>Dashboard</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default MobileNavMenu;
