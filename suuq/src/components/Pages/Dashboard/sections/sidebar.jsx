import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shoplogo from '/public/shoplogo.png';
import {
  Home,
  Package,
  ShoppingCart,
  User,
  Menu,
  Users,
  BarChart2,
  Sun,
  Moon,
  X,
  LogOut,
  SquareArrowOutUpLeft,
} from 'lucide-react';


function Sidebar() {
  const navigate = useNavigate();
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isPackageClicked, setIsPackageClicked] = useState(false);
  const [isCartClicked, setIsCartClicked] = useState(false);
  const [isUserClicked, setIsUserClicked] = useState(false);
  const [isMoreClicked, setIsMoreClicked] = useState(false);


  //-----------------------------------------------------------

  const [darkMode, setDarkMode] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  //-------------------------------------------------------------

  // Dark mode toggle effect
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Function to handle home button click
  const handleHomeClick = () => {
    // Logic to navigate to the home page
    
    setIsPackageClicked(false);
    setIsCartClicked(false);
    setIsUserClicked(false);
    setIsMoreClicked(false);
    setIsHomeClicked(true);
    navigate('/dashboard/');

    console.log('Home button clicked');
  }

  const handlePackageClick = () => {
    // Logic to navigate to the package page
    setIsHomeClicked(false);
    setIsCartClicked(false);
    setIsUserClicked(false);
    setIsMoreClicked(false);
    setIsPackageClicked(true);
    navigate('/dashboard/Products');
    console.log('Package button clicked');
  }
  const handleCartClick = () => {
    // Logic to navigate to the cart page
    setIsHomeClicked(false);
    setIsPackageClicked(false);
    setIsUserClicked(false);
    setIsMoreClicked(false);
    setIsCartClicked(true);
    navigate('/dashboard/Orders');
    console.log('Cart button clicked');
  }
  const handleUserClick = () => {
    // Logic to navigate to the user page
    setIsHomeClicked(false);
    setIsPackageClicked(false);
    setIsCartClicked(false);
    setIsMoreClicked(false);
    setIsUserClicked(true);
    navigate('/dashboard/setting');
    console.log('User button clicked');
  }
  const handleMoreClick = () => {
    // Logic to navigate to the more options page
    setIsHomeClicked(false);
    setIsPackageClicked(false);
    setIsCartClicked(false);
    setIsUserClicked(false);
    setIsMoreClicked(true);
    console.log('More button clicked');
  }

  return (
    <>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col justify-between bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen w-56 shadow-md px-4 py-6">
        <div className="flex flex-col items-center">
          <img className="mb-4 w-16 h-16 rounded-full" src={shoplogo} alt="Logo" />
          <h1 className="text-center text-lg font-semibold">Mubaarak Abdikaadir</h1>
          <hr className="my-4 border-gray-400 dark:border-gray-600 w-full" />

          <ul className="space-y-3 w-full text-center">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard/')}>Dashboard</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard/Products')}>Products</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard/Orders')}>Orders</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard/Customers')}>Customers</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard/Reports')}>Reports</li>
          </ul>

          <hr className="my-4 border-gray-400 dark:border-gray-600 w-full" />

          <ul className="space-y-3 w-full text-center">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard/setting')}>Settings</li>
            <li className="hover:text-blue-500 cursor-pointer">Help</li>
          </ul>
        </div>

        <div className="flex justify-center mt-6">
        <button
           // replace with your actual logout logic
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-600 transition"
          title="Logout"
        >
          <LogOut size={20} className="text-red-600 dark:text-white" 
          onAbort={() => alert('Logout clicked')}
          />
        </button>
        </div>
      </div>







      {/* Overlay for Mobile View */}
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-gray-200 dark:bg-gray-800 shadow-inner border-t border-gray-300 dark:border-gray-700 flex justify-around py-2 z-50">
        

        <button className={`
        ${isHomeClicked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-100 '}
          hover:text-blue-500
          `}>
          <Home size={24} 
          onClick={() => handleHomeClick()}
          />
        </button>

        <button className={`
        ${isPackageClicked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-100 '}
          hover:text-blue-500
          `}>
          <Package size={24} 
          onClick={() => handlePackageClick()}
          />
        </button>



        <button className={`
        ${isCartClicked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-100 '}
          hover:text-blue-500
          `}>
          <ShoppingCart size={24} 
          onClick={() => handleCartClick()}
          />
        </button>


        <button className={`
        ${isUserClicked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-100 '}
          hover:text-blue-500
          `}>
          <User size={24} 
          onClick={() => handleUserClick()}
          />
        </button>


        <button
          onClick={() => setDrawerOpen(true)}
          className={`
          ${isMoreClicked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-100 '}
          hover:text-blue-500
          `}
          title="More Options"
        >
          <Menu size={24} 
          onClick={() => handleMoreClick()}
          />
        </button>
      </div>


      {/* Slide-Out Drawer for Extra Options */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-end">
          <div className="w-2/3 h-full bg-white dark:bg-gray-800 p-4 shadow-lg animate-slide-in-right">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">More</h2>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="text-gray-700 dark:text-gray-100" 
                onClick={() => setIsMoreClicked(false)}
                />
              </button>
            </div>
            <ul className="space-y-4 text-gray-800 dark:text-gray-200">


              <li className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
              onClick={() => {
                setDrawerOpen(false);
                setIsMoreClicked(false);
                navigate('/dashboard/Customers');
              }}
              >
                <Users size={20} />
                <span>Customers</span>
              </li>



              <li className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
              onClick={() => {
                setDrawerOpen(false);
                setIsMoreClicked(false);
                navigate('/dashboard/Reports')
              }}
              >
                <BarChart2 size={20} />
                <span>Reports</span>
              </li>


              <li className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/');
                }}
              >
                <SquareArrowOutUpLeft size={20} />
                <span>Go Home</span>

              </li>
            </ul>
          </div>
        </div>
      )}

      
    </>
  );
}

export default Sidebar;
