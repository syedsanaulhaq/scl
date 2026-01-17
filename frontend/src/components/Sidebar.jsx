import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';
import '../styles/sidebar.css';

const Sidebar = ({ isOpen, onToggle, onClose }) => {
  const navigate = useNavigate();
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
      icon: '📚',
      label: 'Education',
      submenu: [
        { label: 'Dashboard v.1', href: '/dashboard' },
        { label: 'Dashboard v.2', href: '/dashboard' },
        { label: 'Dashboard v.3', href: '/dashboard' },
      ]
    },
    {
      icon: '📊',
      label: 'Analytics',
      href: '/analytics'
    },
    {
      icon: '🎛️',
      label: 'Widgets',
      href: '/widgets'
    },
    {
      icon: '📅',
      label: 'Event',
      href: '/events'
    },
    {
      icon: '👨‍🏫',
      label: 'Professors',
      href: '/professors',
      submenu: [
        { label: 'All Professors', href: '/professors' },
        { label: 'Add Professor', href: '/professors/add' },
      ]
    },
    {
      icon: '👨‍🎓',
      label: 'Students',
      href: '/students',
      submenu: [
        { label: 'All Students', href: '/students' },
        { label: 'Add Student', href: '/students/add' },
      ]
    },
    {
      icon: '📖',
      label: 'Courses',
      href: '/courses',
      submenu: [
        { label: 'All Courses', href: '/courses' },
        { label: 'Add Course', href: '/courses/add' },
      ]
    },
    {
      icon: '🏛️',
      label: 'Library',
      href: '/library',
      submenu: [
        { label: 'Library Assets', href: '/library' },
        { label: 'Add Assets', href: '/library/add' },
      ]
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onToggle}
        className="sidebar-toggle"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h1 className="sidebar-title">KIAALAP</h1>
          <p className="sidebar-subtitle">Education Platform</p>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div key={index} className="nav-item-wrapper">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="nav-item-btn"
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    <ChevronDown 
                      className={`nav-chevron ${
                        expandedMenu === item.label ? 'expanded' : ''
                      }`}
                    />
                  </button>
                  {expandedMenu === item.label && (
                    <div className="nav-submenu">
                      {item.submenu.map((subitem, subindex) => (
                        <Link
                          key={subindex}
                          to={subitem.href}
                          onClick={onClose}
                          className="nav-subitem"
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  onClick={onClose}
                  className="nav-item"
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
