import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Hash Password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare Password
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT Access Token
 */
export const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    instituteId: user.instituteId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '15m',
  });
};

/**
 * Generate JWT Refresh Token
 */
export const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};

/**
 * Generate Both Tokens
 */
export const generateTokens = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
