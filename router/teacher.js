const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

// Existing: Get list of teacher full names
router.get("/teacher_name", (request, response) => {
  const statement = "SELECT CONCAT(first_name,' ',last_name) AS teacher_name FROM teacher";
  db.pool.query(statement, (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

// Existing: Get teacher by id with full name
router.post("/teacherbyid", (request, response) => {
  const { teacher_id } = request.body;

  if (!teacher_id) {
    return response.send(utils.createError("Teacher ID is required"));
  }

  const teacherStatement = `SELECT CONCAT(first_name,' ',last_name) AS teacher_name FROM teacher WHERE teacher_id=?`;
  db.pool.execute(teacherStatement, [teacher_id], (error, teachers) => {
    if (error) {
      console.error("DB Error:", error);
      return response.send(utils.createError(error));
    }
    response.send(utils.createResult(null, teachers));
  });
});

// Get all teachers (full details)
router.get("/allTeachers", (req, res) => {
  const statement = `
    SELECT teacher_id, first_name, last_name, email
    FROM teacher
  `;
  db.pool.execute(statement, (error, results) => {
    res.send(utils.createResult(error, results));
  });
});

// Get total teacher count
router.get("/teacherCount", (req, res) => {
  const statement = `SELECT COUNT(*) AS count FROM teacher`;
  db.pool.execute(statement, (error, results) => {
    if (error) {
      res.send(utils.createError(error));
    } else {
      res.send(utils.createResult(null, results[0]));
    }
  });
});

// Add new teacher
router.post("/addTeacher", (req, res) => {
  const { first_name, last_name, email, phone_number, department } = req.body;

  if (!first_name || !last_name) {
    return res.send(utils.createError("First name and Last name are required"));
  }

  const statement = `
    INSERT INTO teacher 
    (first_name, last_name, email, phone_number, department)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.pool.execute(
    statement,
    [first_name, last_name, email, phone_number, department],
    (error, result) => {
      res.send(utils.createResult(error, result));
    }
  );
});

// Update teacher by ID
router.put("/updateTeacher/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone_number, department } = req.body;

  const statement = `
    UPDATE teacher
    SET first_name=?, last_name=?, email=?, phone_number=?, department=?
    WHERE teacher_id=?
  `;

  db.pool.execute(
    statement,
    [first_name, last_name, email, phone_number, department, id],
    (error, result) => {
      res.send(utils.createResult(error, result));
    }
  );
});

// Delete teacher by ID
router.delete("/deleteTeacher/:id", (req, res) => {
  const { id } = req.params;
  const statement = `DELETE FROM teacher WHERE teacher_id=?`;

  db.pool.execute(statement, [id], (error, result) => {
    res.send(utils.createResult(error, result));
  });
});

module.exports = router;
