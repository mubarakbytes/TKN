// src/components/header/DesktopPrimaryHeader.jsx
import { useState, useEffect } from "react"; // Keep useState for local states (like popups)
import {
  MagnifyingGlassIcon,
  ListBulletIcon,
  UserIcon,
  ShoppingCartIcon,
  XCircleIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon // For Logout icon
} from "@heroicons/react/24/outline";
import { useCart } from '../../components/other/CartContext';
import AuthForm from "./auth/AuthForm";
import Popup from '../other/Popup';
import { DEFAULT_PROFILE_IMAGE } from '../../utils/constants';
import Settings from './auth/Settings';

// Helper function to get profile image URL
const getProfileImageUrl = (user) => {
  if (!user) {
    console.log('No user provided to getProfileImageUrl');
    return DEFAULT_PROFILE_IMAGE;
  }
  
  try {
    console.log('Profile image data:', user.profile_image?.substring(0, 100) + '...');
    if (user.profile_image) {
      // Check if it's already a data URL
      if (user.profile_image.startsWith('data:image')) {
        console.log('Image is already a data URL');
        return user.profile_image;
      }
      // If it's just base64 data, add the data URL prefix
      console.log('Adding data URL prefix to base64 image data');
      return `data:image/jpeg;base64,${user.profile_image}`;
    }
    console.log('No profile image found, using default');
    return DEFAULT_PROFILE_IMAGE;
  } catch (error) {
    console.error('Error processing profile image:', error);
    return DEFAULT_PROFILE_IMAGE;
  }
};

// DesktopPrimaryHeader Component
const DesktopPrimaryHeader = ({ authStatus, currentUser, handleAuthSuccess, handleLogout }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  // Use the cart context (remains local)
  const { cartItems, totalItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  // --- Effect for recent searches (remains local) ---
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);

  // --- Other Handlers (Categories, Search, Cart - remain local) ---
  const selectCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setShowCategories(false);
  };

  const removeCategory = (category) => {
    setSelectedCategories(selectedCategories.filter((item) => item !== category));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "" && !recentSearches.includes(searchQuery)) {
      const updatedSearches = [searchQuery, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
    // Optional: Add search logic here
  };

  const toggleCartDropdown = () => {
    setShowCartDropdown(!showCartDropdown);
  };

  const handleQuantityChange = (itemId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity)) {
        updateQuantity(itemId, newQuantity);
    }
  };

  // --- Open Auth/Profile Popup (remains local, but depends on props) ---
  const openAuthPopup = () => {
    if (authStatus === 'loggedIn') {
      setIsSettingsOpen(true);
    } else {
      setIsAuthFormOpen(true);
    }
  };

  const handleUpdateProfile = async (userData) => {
    // Update the user data in the parent component
    handleAuthSuccess(userData);
    setIsSettingsOpen(false);
  };

  const handleCreateStore = async (storeData) => {
    // Update the user data in the parent component after store creation
    if (storeData.user) {
      handleAuthSuccess(storeData.user);
    }
    setIsSettingsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-700 dark:text-white py-4 shadow-md lg:block md:block hidden">
      <div className="container mx-auto px-4 flex justify-between items-center relative">
        {/* Left - Logo */}
        <div className="flex items-center space-x-4">
          <a href="/" className="font-bold text-2xl text-blue-600 dark:text-white">
            Tukaanmeysi
          </a>
        </div>

        {/* Center - Search Bar & Categories */}
        <div className="relative flex items-center bg-gray-100 dark:bg-gray-600 rounded-md px-3 py-2 flex-grow max-w-lg mx-4">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search essentials, groceries and more..."
            className="bg-transparent border-none focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-sm text-gray-700 dark:text-white w-full"
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          />
          <div className="flex space-x-1 ml-2 flex-shrink-0">
            {selectedCategories.map((category) => (
              <div key={category} className="bg-blue-500 text-white px-2 py-0.5 text-xs rounded flex items-center space-x-1">
                <span>{category}</span>
                <XCircleIcon className="h-3 w-3 cursor-pointer hover:text-gray-300" onClick={() => removeCategory(category)} />
              </div>
            ))}
          </div>
          <button className="ml-2 flex-shrink-0" onClick={() => setShowCategories(!showCategories)}>
            <ListBulletIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" aria-hidden="true" />
          </button>
          {showCategories && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white text-gray-700 dark:bg-gray-900 dark:text-white border dark:border-gray-600 rounded-lg shadow-lg z-50">
              {["Fashion", "Food", "Electronics", "Brands"].map((item) => (
                <div key={item} className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" onClick={() => selectCategory(item)}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Searches Dropdown */}
        {searchQuery && recentSearches.length > 0 && (
           <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-80 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border dark:border-gray-600 rounded-lg shadow-lg z-40">
            <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">Recent Searches</p>
            {recentSearches.map((search, index) => (
              <div key={index} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm" onClick={() => { setSearchQuery(search); handleSearchSubmit(); }}>
                {search}
              </div>
            ))}
          </div>
        )}

        {/* Right Side - Cart and Auth */}
        <div className="flex items-center space-x-4 md:space-x-6 text-sm text-gray-700 dark:text-gray-200 flex-shrink-0">

          {/* Cart Icon and Dropdown */}
          <div className="relative">
            <button onClick={toggleCartDropdown} className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-0.52 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
              <span className="ml-1 hidden sm:inline">Cart</span>
            </button>
            {showCartDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {cartItems.length > 0 ? (
                  <>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 p-2">
                      {cartItems.map((item) => (
                        <li key={item.cartItemId} className="py-3 px-2 flex items-center space-x-3">
                          <img src={item.imageUrl || '/images/placeholder-image.png'} alt={item.name} className="w-12 h-12 object-cover rounded flex-shrink-0 bg-gray-200 dark:bg-gray-700" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                            {item.selectedColor && <p className="text-xs text-gray-500 dark:text-gray-400">Color: {item.selectedColor}</p>}
                            <p className="text-sm text-gray-700 dark:text-gray-300">${(item.price || 0).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                             <input type="number" min="1" value={item.quantity} onChange={(e) => handleQuantityChange(item.cartItemId, e)} className="w-12 px-1 py-0.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center" aria-label={`Quantity for ${item.name}`} />
                             <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-0.5" title="Remove item">
                               <TrashIcon className="h-4 w-4" />
                             </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky bottom-0">
                      <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white mb-2">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <button onClick={() => { window.location.href = "/checkout"; setShowCartDropdown(false); }} className="w-full px-4 py-2 rounded-md text-sm font-medium transition bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                        View Cart & Checkout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    Your cart is empty.
                  </div>
                )}
              </div>
            )}
          </div> {/* End Cart Relative Wrapper */}

          {/* --- Conditional Auth Button --- */}
          <div className="relative">
            <button
              onClick={openAuthPopup}
              disabled={authStatus === 'loading'}
              className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-wait"
              aria-label={authStatus === 'loggedIn' ? `View profile for ${currentUser?.full_name || 'user'}` : "Sign Up or Sign In"}
            >
              {authStatus === 'loading' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500 mr-1"></div>
              ) : authStatus === 'loggedIn' && currentUser ? (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-gray-200 dark:border-gray-600">
                  <img
                    src={getProfileImageUrl(currentUser)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                </div>
              ) : (
                <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-2" aria-hidden="true" />
              )}

              <span className="hidden sm:inline">
                {authStatus === 'loading' ? 'Checking...' : 
                 authStatus === 'loggedIn' ? (currentUser?.full_name || currentUser?.username || 'Account') : 
                 'Sign Up/Sign In'}
              </span>
            </button>

            {/* Profile Settings Popup */}
            <Settings
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onCreateStore={handleCreateStore}
              onLogout={handleLogout}
            />
          </div>
          {/* --- End Conditional Auth Button --- */}

        </div> {/* End Right Side */}

      </div> {/* End Container */}

      {/* Add AuthForm Popup */}
      <Popup isOpen={isAuthFormOpen} onClose={() => setIsAuthFormOpen(false)} title="Authentication">
        <AuthForm onAuthSuccess={(userData) => {
          handleAuthSuccess(userData);
          setIsAuthFormOpen(false);
        }} />
      </Popup>

    </div> // End Main Header Div
  );
};

export default DesktopPrimaryHeader;