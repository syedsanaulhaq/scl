import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  BarChart,
  Settings,
  Calendar,
  GraduationCap,
  Users,
  BookOpen,
  Library
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = ({ isOpen, onToggle, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSubmenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Education',
      submenu: [
        { label: 'Dashboard v.1', href: '/' }, // Changed to root
        { label: 'Dashboard v.2', href: '/dashboard-v2' },
        { label: 'Dashboard v.3', href: '/dashboard-v3' },
      ]
    },
    {
      icon: BarChart,
      label: 'Analytics',
      href: '/analytics'
    },
    {
      icon: Settings,
      label: 'Widgets',
      href: '/widgets'
    },
    {
      icon: Calendar,
      label: 'Event',
      href: '/events'
    },
    {
      icon: Users,
      label: 'Professors',
      href: '/professors',
      submenu: [
        { label: 'All Professors', href: '/professors' },
        { label: 'Add Professor', href: '/professors/add' },
      ]
    },
    {
      icon: GraduationCap,
      label: 'Students',
      href: '/students',
      submenu: [
        { label: 'All Students', href: '/students' },
        { label: 'Add Student', href: '/students/add' },
      ]
    },
    {
      icon: BookOpen,
      label: 'Courses',
      href: '/courses',
      submenu: [
        { label: 'All Courses', href: '/courses' },
        { label: 'Add Course', href: '/courses/add' },
      ]
    },
    {
      icon: Library,
      label: 'Library',
      href: '/library',
      submenu: [
        { label: 'Library Assets', href: '/library' },
        { label: 'Add Assets', href: '/library/add' },
      ]
    },
  ];

  const SidebarItem = ({ item }) => {
    const isActive = location.pathname === item.href || (item.submenu && item.submenu.some(sub => location.pathname === sub.href));
    const Icon = item.icon;

    if (item.submenu) {
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleSubmenu(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors font-medium text-sm",
              isActive ? "text-primary bg-primary/10" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon size={20} />
              <span>{item.label}</span>
            </span>
            <ChevronDown
              size={16}
              className={cn("transition-transform", expandedMenu === item.label && "rotate-180")}
            />
          </button>

          {expandedMenu === item.label && (
            <div className="ml-9 mt-1 space-y-1">
              {item.submenu.map((subitem, idx) => (
                <Link
                  key={idx}
                  to={subitem.href}
                  onClick={onClose}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm transition-colors",
                    location.pathname === subitem.href
                      ? "text-primary font-medium bg-primary/5"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  {subitem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2 mb-1 rounded-md transition-colors font-medium text-sm",
          isActive
            ? "text-primary bg-primary/10"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        )}
      >
        <Icon size={20} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r bg-card transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <span>KIAALAP</span>
          </Link>
          <button
            onClick={onClose}
            className="ml-auto md:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <Button
            variant="destructive"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
