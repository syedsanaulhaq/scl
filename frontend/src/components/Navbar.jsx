import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-teal-600 shadow-md border-b border-teal-700">
      <div className="w-full h-16 px-6 py-0 flex items-center justify-between">
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 hover:bg-teal-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-white" />
          </button>
          
          <RouterLink to="/" className="flex items-center gap-2 text-white hover:text-teal-100 transition-colors">
            <span className="text-2xl font-bold">KIAALAP</span>
          </RouterLink>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-teal-100 text-sm hidden sm:inline">{user?.email}</span>
              <button
                onClick={() => {
                  logout();
                }}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-teal-700 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <RouterLink
                to="/login"
                className="px-4 py-2 text-white hover:bg-teal-700 rounded-lg transition-colors text-sm font-medium"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Register
              </RouterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
