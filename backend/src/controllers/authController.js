const Joi = require('joi');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

// Validation schemas
const registerSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
  phone_number: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  postal_code: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional(),
  role_name: Joi.string().valid('CUSTOMER', 'ADMIN', 'SUPER_ADMIN').optional().default('CUSTOMER')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
const register = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendErrorResponse(res, 400, 'Validation error', error.details);
    }

    const userData = value;

    // Check if user already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return sendErrorResponse(res, 409, 'User with this email already exists');
    }

    // Create new user
    const newUser = await User.create(userData);

    // Generate JWT token
    const tokenPayload = {
      user_id: newUser.user_id,
      email: newUser.email,
      role: newUser.role_name
    };

    const token = generateToken(tokenPayload);

    // Remove sensitive data from response
    const { password_hash, ...userResponse } = newUser;

    const responseData = {
      user: userResponse,
      token,
      message: 'User registered successfully. Please verify your email.'
    };

    sendSuccessResponse(res, 201, responseData, 'User registered successfully');

  } catch (error) {
    console.error('Registration error:', error);
    sendErrorResponse(res, 500, 'Registration failed', { error: error.message });
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return sendErrorResponse(res, 400, 'Validation error', error.details);
    }

    const { email, password } = value;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid email or password');
    }

    // Check if user is verified (optional - can be enabled later)
    // if (!user.is_verified) {
    //   return sendErrorResponse(res, 403, 'Please verify your email before logging in');
    // }

    // Update last login
    await User.updateLastLogin(user.user_id);

    // Generate JWT token
    const tokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role_name
    };

    const token = generateToken(tokenPayload);

    // Remove sensitive data from response
    const { password_hash, ...userResponse } = user;

    const responseData = {
      user: userResponse,
      token,
      message: 'Login successful'
    };

    sendSuccessResponse(res, 200, responseData, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    sendErrorResponse(res, 500, 'Login failed', { error: error.message });
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    // Remove sensitive data
    const { password_hash, ...userResponse } = user;

    sendSuccessResponse(res, 200, { user: userResponse }, 'Profile retrieved successfully');

  } catch (error) {
    console.error('Get profile error:', error);
    sendErrorResponse(res, 500, 'Failed to retrieve profile', { error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const updateData = req.body;

    // Validate update data (basic validation)
    const allowedFields = [
      'first_name', 'last_name', 'phone_number', 'address',
      'city', 'state', 'postal_code', 'country'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return sendErrorResponse(res, 400, 'No valid fields to update');
    }

    const updatedUser = await User.updateUser(userId, filteredData);

    // Remove sensitive data
    const { password_hash, ...userResponse } = updatedUser;

    sendSuccessResponse(res, 200, { user: userResponse }, 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    sendErrorResponse(res, 500, 'Failed to update profile', { error: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await User.getAllUsers(page, limit);

    // Remove password hashes from response
    const usersResponse = result.users.map(user => {
      const { password_hash, ...userData } = user;
      return userData;
    });

    sendSuccessResponse(res, 200, {
      users: usersResponse,
      pagination: result.pagination
    }, 'Users retrieved successfully');

  } catch (error) {
    console.error('Get all users error:', error);
    sendErrorResponse(res, 500, 'Failed to retrieve users', { error: error.message });
  }
};

// Email verification (placeholder for future implementation)
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    // This is a placeholder - in production, you'd verify the token
    // and update the user's is_verified status

    sendSuccessResponse(res, 200, null, 'Email verification placeholder - implement token verification logic');

  } catch (error) {
    console.error('Email verification error:', error);
    sendErrorResponse(res, 500, 'Email verification failed', { error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  verifyEmail
};
