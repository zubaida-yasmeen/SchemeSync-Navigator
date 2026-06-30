import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const hideNavbarRoutes = ['/login', '/register', '/admin-login'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="app-layout">
      {!shouldHideNavbar && user && (
        <div className="fixed-header">
          <Navbar />
        </div>
      )}
      
      <main className={`main-content ${!shouldHideNavbar && user ? 'with-header-footer' : 'full-height'}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      
      {!shouldHideNavbar && user && (
        <div className="fixed-footer">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
