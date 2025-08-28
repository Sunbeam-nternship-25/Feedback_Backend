const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",             // your MySQL username
    password: "Krisha@2910",// your MySQL password
    database: "feedback_system_db"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database!");
});

// Test route
app.get("/", (req, res) => {
    res.send("Teacher Module Backend Running!");
});

app.post("/teacher/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM teacher WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).send("Error checking login");
        if (results.length > 0) {
            res.json({ message: "Login successful", teacher: results[0] });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
