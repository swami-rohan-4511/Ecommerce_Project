const { executeQuery } = require('../config/database');

// Get Health Status
const getHealthStatus = async (req, res, next) => {
  try {
    // Check API Status
    const apiStatus = 'healthy';

    // Check Database Status
    const dbQuery = 'SELECT 1 as db_check';
    await executeQuery(dbQuery);
    const dbStatus = 'connected';

    // Get Database Statistics
    const userCountQuery = 'SELECT COUNT(*) as total_users FROM users';
    const productCountQuery = 'SELECT COUNT(*) as total_products FROM products';
    const orderCountQuery = 'SELECT COUNT(*) as total_orders FROM orders';

    const [userResult] = await Promise.all([
      executeQuery(userCountQuery),
      executeQuery(productCountQuery),
      executeQuery(orderCountQuery),
    ]);

    const users = userResult[0]?.total_users || 0;
    const products = await executeQuery(productCountQuery);
    const orders = await executeQuery(orderCountQuery);

    res.status(200).json({
      status: 'success',
      data: {
        api: {
          status: apiStatus,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
        database: {
          status: dbStatus,
          stats: {
            total_users: users,
            total_products: products[0]?.total_products || 0,
            total_orders: orders[0]?.total_orders || 0,
            active_users: users > 0 ? true : false,
          },
        },
        server: {
          environment: process.env.NODE_ENV,
          version: '1.0.0',
          memory: {
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          },
        },
      },
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    res.status(503).json({
      status: 'error',
      data: {
        api: {
          status: 'unhealthy',
          error: error.message,
        },
        database: {
          status: 'disconnected',
        },
      },
    });
  }
};

module.exports = {
  getHealthStatus,
};
