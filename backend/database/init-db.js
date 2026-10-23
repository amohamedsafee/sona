const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config');

async function initializeDatabase() {
  console.log('[Init-DB] Starting database initialization...');

  // Connect without database first to ensure database exists
  const rootConn = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    port: config.db.port,
    multipleStatements: true
  });

  try {
    const schemaSqlPath = path.join(__dirname, 'schema.sql');
    const seedSqlPath = path.join(__dirname, 'seed.sql');

    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');

    console.log(`[Init-DB] Applying schema from ${schemaSqlPath}...`);
    await rootConn.query(schemaSql);
    console.log('[Init-DB] Schema applied successfully.');

    console.log(`[Init-DB] Seeding database from ${seedSqlPath}...`);
    await rootConn.query(seedSql);
    console.log('[Init-DB] Seed data inserted successfully.');

    console.log('[Init-DB] Database initialization complete!');
  } catch (err) {
    console.error('[Init-DB Error]', err);
    process.exit(1);
  } finally {
    await rootConn.end();
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
