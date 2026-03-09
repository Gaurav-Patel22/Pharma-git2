const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ================= SIGN UP =================
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // Use 'name' to match your DB column precisely
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            // This triggers if the email already exists in the DB
            return res.json({ success: false, message: "User already exists" });
        }
        res.json({ success: true, message: "Signup successful" });
    });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ success: false, message: "Database error" });

        if (result.length > 0) {
            // result[0].name matches your DB column
            res.json({ 
                success: true, 
                user: { name: result[0].name, email: result[0].email } 
            });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    });
});
// ================= SERVER =================
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
