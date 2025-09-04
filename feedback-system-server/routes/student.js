const express = require('express');
const router = express.Router();
const { pool } = require('../teacher-backend/db');

// Get All Students (Protected)
router.get('/', (req, res) => {
  pool.execute('SELECT student_id, first_name, last_name, email FROM student', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;

