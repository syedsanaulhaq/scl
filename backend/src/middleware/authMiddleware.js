import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
import logger from '../config/logger.js';

/**
 * Verify JWT Access Token
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Access token is required', 401));
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Access token has expired', 401));
      }
      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid access token', 401));
      }
      return next(new AppError('Token verification failed', 401));
    }
  } catch (error) {
    logger.error('Token verification error:', error);
    next(error);
  }
};

/**
 * Verify User Role
 * Used for role-based access control
 */
export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (!allowedRoles.includes(req.user.role)) {
        return next(
          new AppError(
            `This action requires one of these roles: ${allowedRoles.join(', ')}`,
            403
          )
        );
      }

      next();
    } catch (error) {
      logger.error('Role verification error:', error);
      next(error);
    }
  };
};

/**
 * Optional Token Verification
 * Doesn't fail if token is missing, but verifies if provided
 */
export const optionalToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
      } catch (error) {
        // Token is invalid but not required for this endpoint
        logger.debug('Optional token verification failed:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional token verification error:', error);
    next(error);
  }
};
