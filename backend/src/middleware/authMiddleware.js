const jwt = require('jsonwebtoken');
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { sendErrorResponse } = require('../utils/apiResponse');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return sendErrorResponse(res, 401, 'Access token is required');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user details from database
    const user = await User.findById(decoded.user_id);
    if (!user) {
      return sendErrorResponse(res, 401, 'User not found or inactive');
    }

    // Attach user to request object
    req.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role_name,
      first_name: user.first_name,
      last_name: user.last_name
    };

    next();

  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return sendErrorResponse(res, 401, 'Invalid token');
    }

    if (error.name === 'TokenExpiredError') {
      return sendErrorResponse(res, 401, 'Token expired');
    }

    sendErrorResponse(res, 500, 'Authentication failed', { error: error.message });
  }
};

// Middleware to check if user has required role(s)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendErrorResponse(res, 401, 'Authentication required');
      }

      const userRole = req.user.role;

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(userRole)) {
        return sendErrorResponse(res, 403, `Access denied. Required role(s): ${allowedRoles.join(', ')}`);
      }

      next();

    } catch (error) {
      console.error('Authorization error:', error);
      sendErrorResponse(res, 500, 'Authorization failed', { error: error.message });
    }
  };
};

// Middleware for admin access (ADMIN or SUPER_ADMIN)
const requireAdmin = authorizeRoles('ADMIN', 'SUPER_ADMIN');

// Middleware for super admin access only
const requireSuperAdmin = authorizeRoles('SUPER_ADMIN');

// Middleware for customer access (any authenticated user)
const requireCustomer = (req, res, next) => {
  // Since authenticateToken already checks if user exists and is authenticated
  // This middleware just ensures the user is authenticated
  if (!req.user) {
    return sendErrorResponse(res, 401, 'Authentication required');
  }
  next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.user_id);

        if (user) {
          req.user = {
            user_id: user.user_id,
            email: user.email,
            role: user.role_name,
            first_name: user.first_name,
            last_name: user.last_name
          };
        }
      } catch (error) {
        // Token is invalid but we don't fail the request
        console.log('Optional auth token invalid:', error.message);
      }
    }

    next();

  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue even if optional auth fails
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireSuperAdmin,
  requireCustomer,
  optionalAuth
};
