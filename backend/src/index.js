const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');
const healthCheckRouter = require('./routes/healthCheck');
const authRouter = require('./routes/authRoutes');

// Initialize Express App
const app = express();

// =====================================================
// MIDDLEWARE SETUP
// =====================================================

// Security Middleware
app.use(helmet()); // Set security headers

// CORS Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : '*',
  credentials: true,
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging Middleware
app.use(morgan('combined'));

// =====================================================
// ROUTES
// =====================================================

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Health Check Route
app.use(`${apiPrefix}/health`, healthCheckRouter);

// Authentication Routes
app.use(`${apiPrefix}/auth`, authRouter);

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API Server',
    version: '1.0.0',
    status: 'running',
    docs: '/api/v1/docs',
  });
});

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// =====================================================
// SERVER STARTUP
// =====================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Start Express Server
    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log('║     E-Commerce Backend Server          ║');
      console.log('╚════════════════════════════════════════╝');
      console.log('');
      console.log(`✓ Server running on: http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ API Prefix: ${apiPrefix}`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`  - GET  ${apiPrefix}/health`);
      console.log(`  - POST ${apiPrefix}/auth/register`);
      console.log(`  - POST ${apiPrefix}/auth/login`);
      console.log(`  - GET  ${apiPrefix}/auth/profile (protected)`);
      console.log(`  - PUT  ${apiPrefix}/auth/profile (protected)`);
      console.log(`  - GET  ${apiPrefix}/auth/users (admin only)`);
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
