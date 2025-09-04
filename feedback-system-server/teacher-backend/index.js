const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Teacher Registration API
app.post('/teachers', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO teacher (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [first_name, last_name, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Teacher registered successfully');
    }
  );
});

// Teacher Login API
app.post('/teachers/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM teacher WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(400).send('Teacher not found');
      const teacher = results[0];
      const validPassword = await bcrypt.compare(password, teacher.password);
      if (!validPassword) return res.status(400).send('Incorrect password');
      res.send('Login successful');
    }
  );
});

// Get all teachers
app.get('/teachers', (req, res) => {
  db.query('SELECT teacher_id, first_name, last_name, email FROM teacher', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/teachers/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM teacher WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(400).send('Teacher not found');
      const teacher = results[0];
      const validPassword = await bcrypt.compare(password, teacher.password);
      if (!validPassword) return res.status(400).send('Incorrect password');
      res.send('Login successful');
    }
  );
});
app.get('/teachers', (req, res) => {
  db.query('SELECT teacher_id, first_name, last_name, email FROM teacher', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.listen(5000, () => console.log('Server running on port 5000'));


