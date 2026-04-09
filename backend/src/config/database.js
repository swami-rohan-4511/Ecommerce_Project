const mysql = require('mysql2/promise');
require('dotenv').config();

// Create Connection Pool for Better Performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// Get Connection (For queries)
const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    throw error;
  }
};

// Execute Query
const executeQuery = async (query, values = []) => {
  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    console.error('Query Execution Error:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

const executeQueryRaw = async (query, values = []) => {
  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.query(query, values);
    return results;
  } catch (error) {
    console.error('Query Execution Error:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Test Database Connection
const testConnection = async () => {
  try {
    const connection = await getConnection();
    console.log('✓ Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
};

// module.exports = {
//   pool,
//   getConnection,
//   executeQuery,
//   testConnection,
// };
module.exports = { pool, getConnection, executeQuery, executeQueryRaw, testConnection };