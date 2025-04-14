import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;