import express from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import userRoutes from './userRoutes.js'; // Added import for userRoutes

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SCL API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
router.use('/v1/auth', authRoutes);
router.use('/v1/courses', courseRoutes);
router.use('/v1/users', userRoutes); // Registered user routes

// Catch all undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

export default router;
