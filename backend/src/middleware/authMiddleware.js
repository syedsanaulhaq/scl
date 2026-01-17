import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import AppError from '../errors/AppError.js';

/**
 * Authentication and Authorization Middleware
 */

/**
 * Verify JWT token from Authorization header
 * Extracts token from 'Bearer <token>' format and verifies it
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Missing or invalid authorization header', 401));
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Token has expired', 401));
      }
      return next(new AppError('Invalid token', 401));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user role - factory function
 * Creates middleware that checks if user has required role(s)
 * @param {...string} allowedRoles - Roles allowed to access endpoint
 * @returns {Function} Express middleware
 */
export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt: User ${req.user.email} (${req.user.role}) tried to access admin route`);
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

/**
 * Optional token verification
 * Verifies token if provided, but doesn't require it
 * Useful for endpoints that behave differently for authenticated vs anonymous users
 */
export const optionalToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        // Token invalid or expired - but that's okay, just continue without user
        logger.debug('Optional token verification failed:', error.message);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
