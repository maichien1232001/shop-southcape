import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SearchOverlay from '../features/search/components/SearchOverlay';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light text-brand-dark selection:bg-brand-forest selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* Các thành phần overlay toàn cục điều khiển bằng Redux */}
      <SearchOverlay />
    </div>
  );
};

export default Layout;
