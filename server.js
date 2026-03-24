// server.js
"use strict";

require("dotenv").config(); // Must be the first require so all process.env vars are set

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/**
 * CORS: lock down to your actual frontend origin in production.
 * origin: "*" is fine for local dev but leaves your API wide open on EC2.
 * Example: origin: "https://your-frontend-domain.com"
 */
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * POST /api/signup
 *
 * Key changes from original:
 *  - pool.execute() replaces the callback-based db.query().
 *  - The whole handler is async/await — no nested callbacks.
 *  - Input validation added: reject requests missing required fields.
 *  - Duplicate-email handled separately (MySQL error code ER_DUP_ENTRY)
 *    so the client gets a clear message rather than a raw DB error.
 *  - Errors are thrown instead of silently swallowed — the global error
 *    handler below catches them and returns a consistent JSON response.
 */
app.post("/api/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await pool.execute(sql, [name, email, hashedPassword]);

    return res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    // ER_DUP_ENTRY is MySQL's error code for a UNIQUE constraint violation
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ success: false, message: "An account with that email already exists" });
    }
    // Pass all other unexpected errors to the global error handler
    next(err);
  }
});

/**
 * POST /api/login
 *
 * Key changes from original:
 *  - Full async/await — no callback-inside-async anti-pattern.
 *  - Uses a consistent response time for both "user not found" and
 *    "wrong password" to prevent user enumeration attacks.
 *  - Throws to the global error handler on unexpected DB errors.
 */
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.execute(sql, [email]);

    // Use a constant-time comparison even for the "user not found" branch
    // to prevent attackers from timing responses to enumerate valid emails.
    const GENERIC_DENIAL = { success: false, message: "Invalid credentials" };

    if (rows.length === 0) {
      // Still call bcrypt.compare with a dummy hash to consume the same
      // time as a real comparison — timing attack mitigation.
      await bcrypt.compare(password, "$2a$10$invalidhashpaddingtomakeittaketime");
      return res.status(401).json(GENERIC_DENIAL);
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json(GENERIC_DENIAL);
    }

    return res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /health
 *
 * Liveness + readiness probe: checks the DB pool can execute a query,
 * not just that the Express process is alive. Load balancers and tools
 * like AWS ALB target group health checks benefit from this distinction.
 */
app.get("/health", async (req, res, next) => {
  try {
    await pool.execute("SELECT 1");
    return res.status(200).json({ status: "OK", db: "connected" });
  } catch (err) {
    // Return 503 so the load balancer pulls this instance from rotation
    return res.status(503).json({ status: "ERROR", db: "unreachable" });
  }
});

// ---------------------------------------------------------------------------
// Global error handler
// Must have exactly 4 parameters — Express identifies it as an error handler
// by the (err, req, res, next) signature.
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[error]", err.stack || err.message);
  return res.status(500).json({
    success: false,
    message: "An internal server error occurred",
  });
});

// ---------------------------------------------------------------------------
// Process-level safety nets
// Prevent the Node process from dying on unhandled promise rejections
// or unexpected thrown errors outside Express middleware.
// ---------------------------------------------------------------------------
process.on("unhandledRejection", (reason) => {
  console.error("[process] Unhandled promise rejection:", reason);
  // Do NOT call process.exit() here — log it and let the app keep running.
  // If you want stricter behaviour, exit with code 1 and let PM2/systemd restart.
});

process.on("uncaughtException", (err) => {
  console.error("[process] Uncaught exception:", err.message);
  // uncaughtException leaves the process in an undefined state — safe to exit.
  process.exit(1);
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});