// src/components/header/HeaderController.jsx
import { useEffect, useState } from 'react';
import SecondaryHeader from './SecondaryHeader';
import DesktopPrimaryHeader from './DesktopPrimaryHeader';
import MobilePrimaryHeader from './MobilePrimaryHeader';

const HeaderController = () => {
  // State for mobile view detection
  const [isMobile, setIsMobile] = useState(false); // Default to false, useEffect will correct

  // --- Lifted Authentication State ---
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'loggedIn', 'loggedOut'
  const [currentUser, setCurrentUser] = useState(null); // Store user details if logged in

  // --- Effect to check session status on load (now in the parent) ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("HeaderController: Checking auth status..."); // Debugging
      try {
        // Use relative path for API calls
        const response = await fetch('/api/auth/status',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          // Don't throw error for 401/403, just means not logged in
          if (response.status === 401 || response.status === 403) {
             console.log("HeaderController: Auth status check - Not logged in (401/403).");
             setAuthStatus('loggedOut');
             setCurrentUser(null);
             return; // Exit try block successfully
          }
          // Throw error for other unexpected statuses
          throw new Error(`Auth status check laguma guleysan: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.isLoggedIn && data.user && data.user.id) {
          console.log("HeaderController: Auth status check - Logged In. User data:", data.user); // Debugging
          setAuthStatus('loggedIn');
          setCurrentUser(data.user);
        } else {
          console.log("HeaderController: Auth status check - Logged Out or missing data in response."); // Debugging
          setAuthStatus('loggedOut');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('HeaderController: Auth check failed:', error.message);
        setAuthStatus('loggedOut'); // Assume logged out on error
        setCurrentUser(null);
      }

    };
    checkAuthStatus();
  }, []); // Run once on mount

  useEffect(() => {
    const checkMobileScreen = () => {
      setIsMobile(window.innerWidth <= 768); // Example breakpoint - adjust as needed
    };

    checkMobileScreen(); // Check on initial load
    window.addEventListener('resize', checkMobileScreen); // Check on window resize

    return () => {
      window.removeEventListener('resize', checkMobileScreen); // Cleanup listener on unmount
    };
  }, []); // Separate effect for screen size check

  // --- Lifted Handlers ---
  const handleAuthSuccess = (userData) => {
    console.log("HeaderController: Auth success handler called. User data:", userData);
    if (userData && userData.id) { // Basic check
        setAuthStatus('loggedIn');
        setCurrentUser(userData);
        // Popups are managed locally in child components, no need to close here
    } else {
        console.error("HeaderController: Auth success handler received invalid user data:", userData);
        // Optionally set an error state or revert to loggedOut if needed
        setAuthStatus('loggedOut');
        setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    console.log("HeaderController: Handling logout...");
    try {
      // Call the backend logout endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('HeaderController: Logout API call failed:', error);
      // Still proceuserDataed with frontend logout even if API fails
    } finally {
      // Update frontend state
      setAuthStatus('loggedOut');
      setCurrentUser(null);
      console.log("HeaderController: Frontend state set to logged out.");
      // Popups are managed locally in child components
    }
  };

  return (
    <header> {/* Use header HTML element for semantic correctness */}
      <SecondaryHeader className="lg:block block lg:fixed"  /> {/* Always render SecondaryHeader - adjust visibility inside component if needed */}
      {/* Pass state and handlers down to the appropriate header */}
      {isMobile ? (
        <MobilePrimaryHeader
          authStatus={authStatus}
          currentUser={currentUser}
          handleAuthSuccess={handleAuthSuccess}
          handleLogout={handleLogout}
        />
      ) : (
        <DesktopPrimaryHeader
          authStatus={authStatus}
          currentUser={currentUser}
          handleAuthSuccess={handleAuthSuccess}
          handleLogout={handleLogout}
        />
      )}
    </header>
  );
};

export default HeaderController;