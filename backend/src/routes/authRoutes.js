import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';
import { validate, validationSchemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * Public Auth Routes
 */

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', validate(validationSchemas.register), register);

// @route   POST /api/auth/login
// @desc    Login user and return tokens
// @access  Public
router.post('/login', validate(validationSchemas.login), login);

// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh', refreshToken);

/**
 * Protected Auth Routes
 */

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', verifyToken, getProfile);

// @route   PATCH /api/auth/profile
// @desc    Update current user profile
// @access  Private
router.patch('/profile', verifyToken, updateProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', verifyToken, logout);

export default router;
