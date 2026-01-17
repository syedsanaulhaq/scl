import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/layout.css';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar visible by default

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onClose={handleCloseSidebar}
      />
      <div className="app-main-container">
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
