const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool(config.db);

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL database: ${config.db.database}`);
    connection.release();
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MySQL:`, error.message);
  }
})();

module.exports = {
  pool,
  query: async (sql, params = []) => {
    const [rows, fields] = await pool.query(sql, params);
    return rows;
  },
  execute: async (sql, params = []) => {
    const [result] = await pool.execute(sql, params);
    return result;
  }
};
