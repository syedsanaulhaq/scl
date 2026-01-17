import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onClose={handleCloseSidebar}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar onToggleSidebar={handleToggleSidebar} />
        
        <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
          {children}
        </Container>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: '#f3f4f6',
            py: 4,
            mt: 'auto',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', color: '#6b7280' }}>
              <p>&copy; 2026 SCL - Education Institute Management System. All rights reserved.</p>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
