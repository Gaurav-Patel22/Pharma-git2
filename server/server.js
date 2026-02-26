const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();

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

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Email already exists" });
        }

        res.json({ message: "Signup successful" });
    });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(
            password,
            result[0].password
        );

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: result[0].id,
                name: result[0].name,
                email: result[0].email
            }
        });
    });
});

// ================= SERVER =================
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
