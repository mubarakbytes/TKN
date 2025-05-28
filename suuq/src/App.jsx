import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Pages/Home/Home';
import ProfileStore from './components/Pages/Store/ProfileStore';
import HeaderController from './components/header/HeaderController';
import ProductDetail from './components/Pages/Product_detail/Product_detail';
import Dashboard from './components/Pages/Dashboard/dashboard';

function Layout() {
  const location = useLocation();
  const hideHeaderPaths = [
    '/dashboard',
    '/dashboard/',
    '/dashboard/Products',
    '/dashboard/Orders',
    '/dashboard/Customers',
    '/dashboard/Reports',
    '/dashboard/setting'
  ];

  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);
  const DashboardPaths = [
    '/dashboard/',
    '/dashboard/Products',
    '/dashboard/Orders',
    '/dashboard/Customers',
    '/dashboard/Reports',
    '/dashboard/setting'
  ];

  return (
    <>
    <div className='sticky top-0 z-50'>
      {!shouldHideHeader && <HeaderController />}
    </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Home />} />
        <Route path="/suuq" element={<Home />} />
        <Route path="/profile" element={<ProfileStore />} />
        <Route path="/Product-Details/:id" element={<ProductDetail />} />

        {DashboardPaths.map((path, index) => (
          <Route key={index} path={path} element={<Dashboard />} />
        ))}
      </Routes>
    </>
  );
}

function App() {
  useEffect(() => {
    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
    };



    const preventDoubleTapZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent double tap zoom
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventDoubleTapZoom);
    };
  }, []);

  const preventDoubleTapZoom = (e) => {
    if (e.touches.length > 1) {
      e.preventDefault(); // Prevent double tap zoom
    }
  };
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
