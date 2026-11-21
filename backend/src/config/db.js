const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'senkanan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log(`[DB] Terhubung ke MySQL (${process.env.DB_NAME || 'senkanan'})`);
    conn.release();
  } catch (err) {
    console.error('[DB] Gagal terhubung ke MySQL:', err.message);
  }
}

module.exports = { pool, testConnection };
