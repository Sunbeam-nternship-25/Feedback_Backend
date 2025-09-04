const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../teacher-backend/db');
const config = require('../teacher-backend/config');
const utils = require('../teacher-backend/utils');

// Teacher Registration
router.post('/', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const statement = 'INSERT INTO teacher (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    pool.execute(statement, [first_name, last_name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ status: 'success', result });
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Teacher Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const statement = 'SELECT teacher_id, first_name, last_name, email, password FROM teacher WHERE email = ?';
  pool.execute(statement, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (!results || results.length === 0) return res.status(400).send('Teacher not found');
    const teacher = results[0];
    const validPassword = await bcrypt.compare(password, teacher.password);
    if (!validPassword) return res.status(400).send('Incorrect password');
    const token = jwt.sign({ teacher_id: teacher.teacher_id, email: teacher.email }, config.secret, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
});

// Get All Teachers
router.get('/', (req, res) => {
  pool.execute('SELECT teacher_id, first_name, last_name, email FROM teacher', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;

