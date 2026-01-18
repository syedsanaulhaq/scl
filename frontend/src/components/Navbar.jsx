import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <AppBar position="static" sx={{ backgroundColor: '#3a57e8', boxShadow: '0 2px 8px rgba(58, 87, 232, 0.15)', borderRadius: 0, margin: 0, padding: 0 }}>
      <Toolbar sx={{ minHeight: '60px', padding: 0, margin: 0 }}>
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            <Menu size={24} />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>KIAALAP</Box>
          </RouterLink>
        </Box>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{user?.email}</span>
            <Button
              color="inherit"
              onClick={() => {
                logout();
              }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/register"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
