const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// टेस्ट
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ================= SIGNUP =================
app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

        res.json({ success: true, message: "Signup successful" });
    });
});

// ================= LOGIN =================
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Database error" });
        }

        if (result.length > 0) {
            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                return res.json({
                    success: true,
                    user: { name: user.name, email: user.email }
                });
            }
        }

        res.json({ success: false, message: "Invalid credentials" });
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});