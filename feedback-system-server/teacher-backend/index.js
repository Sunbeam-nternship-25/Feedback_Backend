const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { pool } = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Teacher Registration
app.post('/teachers', async (req, res) => {
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
app.post('/teachers/login', (req, res) => {
  const { email, password } = req.body;
  const statement = 'SELECT teacher_id, first_name, last_name, email, password FROM teacher WHERE email = ?';
  pool.execute(statement, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (!results || results.length === 0) return res.status(400).send('Teacher not found');
    const teacher = results[0];
    const validPassword = await bcrypt.compare(password, teacher.password);
    if (!validPassword) return res.status(400).send('Incorrect password');
    res.send('Login successful'); // later we’ll return token here
  });
});

// Get all teachers
app.get('/teachers', (req, res) => {
  pool.execute('SELECT teacher_id, first_name, last_name, email FROM teacher', (err, results) => {
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


