// db.js  (REPLACE contents of existing db.js — keep same filename)
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Krisha@2910',    // keep your DB password
  database: 'feedback_system_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error('MySQL pool error:', err);
  } else {
    console.log('MySQL Pool Connected...');
    conn.release();
  }
});

module.exports = { pool };
