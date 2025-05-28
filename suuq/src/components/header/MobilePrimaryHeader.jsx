// src/components/header/MobilePrimaryHeader.jsx
import React, { useState, useEffect } from 'react'; // Import React and hooks
import MobileNavMenu from './MobileNavMenu';
import MobileSearch from './MobileSearch';
import { Bars3Icon, ShoppingCartIcon, UserIcon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'; // Added ArrowRightOnRectangleIcon
import Popup from '../other/Popup';
import { useCart } from '../other/CartContext';
import AuthForm from "./auth/AuthForm"; // Corrected import name
import { DEFAULT_PROFILE_IMAGE } from '../../utils/constants';

import Settings from './auth/Settings'; // Assuming you have a Settings component
// Helper function to get profile image URL
const getProfileImageUrl = (user) => {
  if (!user) return DEFAULT_PROFILE_IMAGE;
  
  try {
    if (user.profile_image) {
      // Check if it's already a data URL
      if (user.profile_image.startsWith('data:image')) {
        return user.profile_image;
      }
      // If it's just base64 data, add the data URL prefix
      return `data:image/jpeg;base64,${user.profile_image}`;
    }
    return DEFAULT_PROFILE_IMAGE;
  } catch (error) {
    console.error('Error processing profile image:', error);
    return DEFAULT_PROFILE_IMAGE;
  }
};

// --- Updated ProfileDetails Component ---
const ProfileDetails = ({ user, onLogout }) => {
  if (!user) {
    console.error('ProfileDetails: User object is null or undefined');
    return null;
  }

  const profileImageUrl = getProfileImageUrl(user);
  const displayName = user.full_name || user.username || 'User';

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-4 bg-gray-200 dark:bg-gray-600">
        <img
          src={profileImageUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PROFILE_IMAGE;
          }}
          alt="Profile"
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <hr className="w-full border-t border-gray-300 dark:border-gray-700 my-3 sm:my-4" />
      <div className="w-full text-center">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-1 sm:mb-2">{displayName}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{user.email || 'No email'}</p>
        {user.username && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">@{user.username}</p>}
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm w-full flex items-center justify-center gap-2 mt-4"
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
};
// --- End ProfileDetails Component ---



// MobilePrimaryHeader now ACCEPTS PROPS for auth state and handlers
const MobilePrimaryHeader = ({ authStatus, currentUser, handleAuthSuccess, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCartPopupOpen, setCartPopupOpen] = useState(false);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  const { cartItems, removeFromCart, updateQuantity, cartTotal, totalItems } = useCart();

  // --- REMOVED: Authentication State (authStatus, currentUser) ---
  // --- REMOVED: Effect to check session status on load ---
  // --- REMOVED: Authentication Handlers (handleAuthSuccess, handleLogout) ---
  // These are now received as PROPS from the parent component (HeaderController)
  /*
  const handleLogout = async () => {
    console.log("Handling logout..."); // Debugging
    try {
      // Optional: Call your Flask logout endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Update frontend state regardless of API call success/failure
      setAuthStatus('loggedOut');
      setCurrentUser(null);
      setProfilePopupOpen(false); // Close the popup
      console.log("Frontend state set to logged out."); // Debugging
      // Optionally clear other sensitive local storage if needed
      // localStorage.removeItem('someOtherToken');
    }
  }; */ // The actual handleLogout function is now passed as a prop

  // Cart checkout handler
  const handlePay = () => {
    // Consider using React Router's navigate function if you have routing setup
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate('/checkout');
    window.location.href = "/checkout";
  };

  // Open profile/auth popup
  const openProfilePopup = () => {
    if (authStatus === 'loggedIn') {
      setIsSettingsOpen(true);
    } else {
      setIsAuthFormOpen(true);
    }
  };

  const handleUpdateProfile = async (formData) => {
    // Implement profile update logic
  };

  const handleCreateStore = async (storeData) => {
    // Implement store creation logic
  };

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md lg:hidden z-40 dark:bg-gray-900 dark:shadow-gray-500/50">
        <div className="container mx-auto px-4 py-2 grid grid-cols-4 items-center">
          {/* Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(prev => !prev)} aria-label="Open navigation menu" className="flex justify-center">
            <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-white" aria-hidden="true" />
          </button>
          {/* Search */}
          <div className="flex justify-center"> {/* Removed dark:text-white here */}
            <MobileSearch />
          </div>
          {/* Cart Button */}
          <div className="flex justify-center relative">
            <button onClick={() => setCartPopupOpen(true)} aria-label="View cart">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 dark:text-white" aria-hidden="true" />
            </button>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none"> {/* Adjusted padding/leading */}
                {totalItems}
              </span>
            )}
          </div>
          {/* Profile/Login Button */}
          <div className="flex justify-center">
            <button 
              onClick={openProfilePopup} 
              aria-label="Account" 
              disabled={authStatus === 'loading'} 
              className="disabled:opacity-50 relative"
            >
              {authStatus === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
              ) : authStatus === 'loggedIn' && currentUser ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
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
                <UserIcon className="h-6 w-6 text-gray-700 dark:text-white" aria-hidden="true" />
              )}
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
        </div>
      </div>

      {/* Mobile Navigation Menu Popup */}
      {isMobileMenuOpen && (
         <div className="fixed inset-0 z-50 flex"> {/* Removed backdrop-blur-sm for simplicity, can be added back */}
           {/* Overlay */}
           <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setIsMobileMenuOpen(false)} />
           {/* Drawer */}
           <div className="relative"> {/* Wrapper needed for positioning */}
             <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 transform translate-x-0 dark:bg-gray-800">
               <div className="flex justify-end p-4">
                 <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation menu">
                   <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-white" aria-hidden="true" />
                 </button>
               </div>
               <MobileNavMenu />
             </div>
           </div>
         </div>
       )}


      {/* Cart Popup */}
      <Popup isOpen={isCartPopupOpen} onClose={() => setCartPopupOpen(false)} title="Shopping Cart">
         {cartItems.length === 0 ? (
           <p className="text-center text-gray-500 dark:text-gray-300 p-6">Your cart is empty.</p> // Added padding
         ) : (
           <>
             <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto"> {/* Added max-height and scroll */}
               {cartItems.map(item => (
                 <div key={item.cartItemId} className="flex items-center justify-between border-b pb-3 dark:border-gray-700 last:border-b-0"> {/* Adjusted padding/border */}
                   <div className="flex items-center gap-3 flex-1 min-w-0"> {/* Added flex-1 min-w-0 */}
                     <img
                       src={item.imageUrl || 'https://via.placeholder.com/50'}
                       alt={item.name}
                       className="w-12 h-12 rounded object-cover flex-shrink-0" // Added object-cover
                       loading="lazy"
                     />
                     <div className="flex-1 min-w-0"> {/* Added flex-1 min-w-0 */}
                       <p className="text-sm font-medium dark:text-white truncate">{item.name}</p> {/* Added truncate */}
                       {item.selectedColor && (
                           <span className="text-xs text-gray-500 dark:text-gray-400 block">{item.selectedColor}</span>
                       )}
                       <div className="flex items-center gap-2 mt-1">
                         <button
                           onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                           disabled={item.quantity <= 1}
                           className="px-1.5 py-0.5 text-xs bg-gray-200 text-gray-700 rounded disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200" // Adjusted padding
                         >
                           -
                         </button>
                         <span className="text-xs text-gray-700 dark:text-gray-300 w-4 text-center">{item.quantity}</span> {/* Added width/center */}
                         <button
                           onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                           className="px-1.5 py-0.5 text-xs bg-gray-200 text-gray-700 rounded dark:bg-gray-600 dark:text-gray-200" // Adjusted padding
                         >
                           +
                         </button>
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-col items-end gap-1 ml-2"> {/* Added margin */}
                     <span className="text-sm font-semibold dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                     <button
                       className="text-red-500 hover:text-red-700 text-xs dark:text-red-400 dark:hover:text-red-300"
                       onClick={() => removeFromCart(item.cartItemId)}
                       aria-label={`Remove ${item.name}`}
                     >
                       Remove
                     </button>
                   </div>
                 </div>
               ))}
             </div>
             {/* Total and Checkout Button */}
             <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800"> {/* Added background */}
               <div className="flex justify-between items-center mb-3">
                   <span className="text-base font-medium dark:text-white">Total:</span>
                   <span className="text-lg font-semibold text-green-600 dark:text-yellow-400">${cartTotal.toFixed(2)}</span>
               </div>
               <button
                 onClick={handlePay}
                 className="px-4 py-2 rounded w-full text-white font-medium bg-green-500 hover:bg-green-600 transition-colors duration-200"
               >
                 Proceed to Checkout
               </button>
             </div>
           </>
         )}
         {/* Close Button if cart is empty */}
         {cartItems.length === 0 && (
             <div className="p-4 border-t dark:border-gray-700">
               <button
                 onClick={() => setCartPopupOpen(false)}
                 className="px-4 py-2 rounded w-full text-white font-medium bg-gray-500 hover:bg-gray-600 transition-colors duration-200"
               >
                 Close
               </button>
             </div>
         )}
      </Popup>

      {/* Add AuthForm Popup */}
      <Popup isOpen={isAuthFormOpen} onClose={() => setIsAuthFormOpen(false)} title="Authentication">
        <AuthForm onAuthSuccess={(userData) => {
          handleAuthSuccess(userData);
          setIsAuthFormOpen(false);
        }} />
      </Popup>
    </>
  );
};

export default MobilePrimaryHeader;
