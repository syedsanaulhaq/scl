import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '@/components/Navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
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
  );
};

export default Layout;
