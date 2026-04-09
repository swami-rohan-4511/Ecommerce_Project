const express = require('express');
const { getHealthStatus } = require('../controllers/healthController');

const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Check API and Database Health Status
 * @access  Public
 */
router.get('/', getHealthStatus);

module.exports = router;
