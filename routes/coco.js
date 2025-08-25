const express = require("express");
const db = require("../database");
const config = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();



router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, course_name, email, password } = req.body;

    if (!first_name || !last_name || !course_name || !email || !password) {
      return res.status(400).json({ status: "error", error: "All fields required" });
    }

    const [rows] = await db.query("SELECT * FROM coco WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(409).json({ status: "error", error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO coco (first_name, last_name, course_name, email, password) VALUES (?,?,?,?,?)",
      [first_name, last_name, course_name, email, hashedPassword]
    );

    res.json({ status: "success", message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM coco WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ status: "error", error: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "error", error: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    // token
    const token = jwt.sign(payload, config.secret, { expiresIn: "1h" });

   res.json({
  status: "success",
  token: token,
  user: rows[0]
});

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

module.exports = router;
