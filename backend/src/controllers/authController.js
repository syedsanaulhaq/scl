import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
import logger from '../config/logger.js';

/**
 * Generate JWT Access Token
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRY || '15m',
  });
};

/**
 * Generate JWT Refresh Token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};

/**
 * User Registration
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password || !name) {
      return next(new AppError('Email, password, and name are required', 400));
    }

    if (password.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }

    const { User } = req.app.locals.models;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('User with this email already exists', 409));
    }

    // Create new user
    const newUser = await User.create({
      email,
      password,
      name: name.trim(),
      role: role || 'student',
      isActive: true,
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Log registration
    logger.info(`New user registered: ${newUser.email} (${newUser.id})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.toJSON(),
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const { User } = req.app.locals.models;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('User account is inactive', 403));
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Log login
    logger.info(`User logged in: ${user.email} (${user.id})`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * Refresh Access Token
 * POST /api/auth/refresh
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return next(new AppError('Refresh token is required', 400));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret');
      const { User } = req.app.locals.models;

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      // Generate new access token
      const accessToken = generateAccessToken(user);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      return next(new AppError('Invalid refresh token', 401));
    }
  } catch (error) {
    logger.error('Refresh token error:', error);
    next(error);
  }
};

/**
 * Get Current User Profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { User } = req.app.locals.models;

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    next(error);
  }
};

/**
 * Update User Profile
 * PATCH /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return next(new AppError('Name is required', 400));
    }

    const { User } = req.app.locals.models;
    const user = await User.findByPk(userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update user
    user.name = name.trim();
    await user.save();

    logger.info(`User profile updated: ${user.email} (${user.id})`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

/**
 * User Logout
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    logger.info(`User logged out: ${req.user.email} (${userId})`);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};
