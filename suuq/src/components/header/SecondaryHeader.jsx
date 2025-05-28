// src/components/header/SecondaryHeader.jsx
import { MapPinIcon, TruckIcon, TagIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const SecondaryHeader = () => {
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
        if(data.user.is_seller){
          setDashboard(true);
        }
        setThedata(data);
      } catch (error) {
        console.error('Request failed:', error);
      }
    };

    // ⏱️ Wait 5 seconds before running checkAuth
    const timer = setTimeout(() => {
      checkAuth();
    }, 3000);

    // Cleanup timeout if component unmounts early
    return () => clearTimeout(timer);

  }, []);

  console.log('mubaarak props aya isticmaashay ', thedata);
  return (
    <div className="bg-gray-50 py-2 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:block  hidden"> {/* Added lg:block hidden classes */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Welcome to worldwide Tukaanmeysi!
        </div>  
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
          <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" aria-hidden="true" />
            Deliver to {thedata?.user?.country}, {thedata?.user?.city}
          </a>
          <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 flex items-center">
            <TruckIcon className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" aria-hidden="true" />
            Track your order
          </a>
          <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 flex items-center">
            <TagIcon className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" aria-hidden="true" />
            All Offers
          </a>

          {dashboard && (
            <a href="/dashboard" className="hover:text-blue-500 dark:hover:text-blue-400 flex items-center">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" aria-hidden="true" />
              Dashboard
            </a>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;