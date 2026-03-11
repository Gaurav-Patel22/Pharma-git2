const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "172.31.18.203",
    user: "root",
    password: "Gaurav@22092005",
    database: "pharma_cloudops"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed ❌");
    } else {
        console.log("MySQL Connected ✅");
    }
});

module.exports = db;
