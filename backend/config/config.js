require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'sona_luxury_hotel_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sona_hotel_db',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    timezone: '+00:00'
  },
  uploadDir: path.join(__dirname, '..', 'uploads'),
  adminStaticDir: path.join(__dirname, '..', '..', 'admin'),
  frontendStaticDir: path.join(__dirname, '..', '..')
};
