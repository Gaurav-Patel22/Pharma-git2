// db.js
"use strict";

require("dotenv").config();
const mysql = require("mysql2/promise");

/**
 * Connection pool instead of a single connection.
 *
 * Why a pool?
 *  - A single connection blocks: query B waits for query A to finish.
 *  - A pool hands out multiple connections concurrently, so parallel
 *    requests each get their own connection from the pool.
 *  - mysql2/promise means every pool.execute() returns a Promise,
 *    so all callers can safely use async/await with no callback pyramids.
 *
 * waitForConnections: true  → queue requests instead of throwing when
 *                             all connections are busy.
 * connectionLimit: 10       → keep at most 10 open connections at once.
 *                             Tune based on your RDS/EC2 RAM and max_connections.
 * queueLimit: 0             → allow unlimited queued requests (0 = no limit).
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_CONNECTION_LIMIT || "10", 10),
  queueLimit: parseInt(process.env.DB_POOL_QUEUE_LIMIT || "0", 10),
});

/**
 * Validate the pool can actually reach the database on startup.
 * This surfaces bad credentials / unreachable host immediately
 * rather than on the first real request.
 */
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("[db] MySQL pool connected successfully");
  } catch (err) {
    console.error("[db] Could not connect to MySQL:", err.message);
    // Exit with a non-zero code so process managers (systemd, PM2)
    // know the process failed and can restart or alert.
    process.exit(1);
  } finally {
    if (conn) conn.release(); // Always return connections to the pool
  }
}

testConnection();

module.exports = pool;