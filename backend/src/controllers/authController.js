import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import AppError from '../errors/AppError.js';

/**
 * Authentication Controller
 * Handles user registration, login, token refresh, and profile management
 */

/**
 * Register new user
 * @route POST /api/auth/register
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    const { User } = req.app.locals.models;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('Email already registered', 409));
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'student',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { User } = req.app.locals.models;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Account is inactive', 403));
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    logger.info(`User logged in: ${user.email}`);

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
    next(error);
  }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return next(new AppError('Refresh token is required', 400));
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return next(new AppError('Invalid or expired refresh token', 401));
    }

    const { User } = req.app.locals.models;
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive', 401));
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const getProfile = async (req, res, next) => {
  try {
    const { User } = req.app.locals.models;
    const user = await User.findByPk(req.user.id);

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
    next(error);
  }
};

/**
 * Update user profile
 * @route PATCH /api/auth/profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { User } = req.app.locals.models;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update allowed fields only
    if (name) {
      user.name = name;
    }

    await user.save();

    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const logout = async (req, res, next) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate access token
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY || '15m',
    }
  );
}

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    }
  );
}
