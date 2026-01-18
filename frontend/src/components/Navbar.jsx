import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, LogOut, Bell, User } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 bg-background/95 backdrop-blur px-6 border-b shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 hover:bg-accent rounded-md transition-colors text-foreground"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      <div className="flex flex-1 items-center justify-between">
        {/* Breadcrumb or Title Area - Hidden on mobile if needed */}
        <div className="flex items-center gap-2">
          {/* <h2 className="text-lg font-semibold">Dashboard</h2> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          ) : (
            <RouterLink to="/login">
              <Button>Login</Button>
            </RouterLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
