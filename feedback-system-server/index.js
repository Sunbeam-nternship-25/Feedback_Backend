const express = require('express');
const cors = require('cors');
const { pool } = require('./teacher-backend/db');
const jwt = require('jsonwebtoken');
const config = require('./teacher-backend/config');
const utils = require('./teacher-backend/utils');

const app = express();
app.use(cors());
app.use(express.json());

// JWT Middleware
const PUBLIC_PATHS = new Set(['/teachers', '/teachers/login']);
app.use((req, res, next) => {
  if (PUBLIC_PATHS.has(req.path)) return next();
  const token = req.headers['token'];
  if (!token) return res.status(401).send(utils.createError('Missing token'));
  try {
    const data = jwt.verify(token, config.secret);
    req.userInfo = data;
    next();
  } catch (e) {
    return res.status(401).send(utils.createError('Invalid or expired token'));
  }
});

// Routes import
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);

// Server start
const PORT = 5000;
app.listen(PORT, () => console.log('Server running on port 5000'));
