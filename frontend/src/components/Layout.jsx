import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950/20">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onClose={handleCloseSidebar}
      />

      {/* Main Content Wrapper - Shifted by sidebar width on desktop */}
      <div className="flex flex-1 flex-col transition-all duration-300 md:pl-64">
        <Navbar onToggleSidebar={handleToggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 animate-in fade-in duration-500">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-white py-4 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <p>&copy; 2026 SCL - Education Institute Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
