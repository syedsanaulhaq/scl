import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '@/components/Layout';

const HomePage = () => {
  const modules = [
    {
      id: 1,
      title: 'Partner Management',
      description: 'Manage partners and associates',
      icon: '🤝',
    },
    {
      id: 2,
      title: 'Accreditation & QA',
      description: 'Track accreditation and compliance',
      icon: '✓',
    },
    {
      id: 3,
      title: 'Course Offerings',
      description: 'Manage programs and courses',
      icon: '📚',
    },
    {
      id: 4,
      title: 'Student Portal',
      description: 'Student induction and support',
      icon: '👨‍🎓',
    },
    {
      id: 5,
      title: 'Faculty Management',
      description: 'Faculty profiles and HR',
      icon: '👨‍🏫',
    },
    {
      id: 6,
      title: 'Learning Management',
      description: 'Moodle LMS integration',
      icon: '📖',
    },
    {
      id: 7,
      title: 'Governance & ERP',
      description: 'Finance, fees, and operations',
      icon: '⚙️',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)',
          color: 'white',
          borderRadius: 2,
          mb: 6,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          SCL
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Education Institute Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'white', color: '#6B46C1', fontWeight: 'bold' }}
            component={RouterLink}
            to="/login"
          >
            Login
          </Button>
          <Button
            variant="outlined"
            sx={{ borderColor: 'white', color: 'white' }}
            component={RouterLink}
            to="/register"
          >
            Register
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Core Modules
        </Typography>
        <Grid container spacing={3}>
          {modules.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.id}>
              <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', mb: 1 }}>{module.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {module.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          backgroundColor: '#F9FAFB',
          py: 6,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6B46C1' }}>
              7
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Core Modules
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6B46C1' }}>
              40+
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Database Tables
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6B46C1' }}>
              8
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              User Roles
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6B46C1' }}>
              99.5%
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Uptime Target
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default HomePage;
