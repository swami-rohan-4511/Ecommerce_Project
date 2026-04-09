const jwt = require('jsonwebtoken');
const ApiError = require('./apiError');

/**
 * Generate JWT Token
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    throw new ApiError(500, 'Error generating token', { error: error.message });
  }
};

/**
 * Verify JWT Token
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token', { error: error.message });
  }
};

/**
 * Extract Token from Headers
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
};
