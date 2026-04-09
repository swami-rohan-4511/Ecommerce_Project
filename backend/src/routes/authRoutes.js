const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  verifyEmail
} = require('../controllers/authController');

const {
  authenticateToken,
  requireAdmin,
  requireCustomer
} = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private (Customer+)
 */
router.get('/profile', authenticateToken, requireCustomer, getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update current user profile
 * @access  Private (Customer+)
 */
router.put('/profile', authenticateToken, requireCustomer, updateProfile);

/**
 * @route   GET /api/v1/auth/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin+)
 */
router.get('/users', authenticateToken, requireAdmin, getAllUsers);

/**
 * @route   GET /api/v1/auth/verify-email
 * @desc    Verify user email (placeholder)
 * @access  Public
 */
router.get('/verify-email', verifyEmail);

module.exports = router;
