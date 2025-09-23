const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

// Get all students (existing)
router.get("/allStudents", (req, res) => {
  const statement = `
    SELECT s.student_id, s.first_name, s.last_name, s.email, s.prn_no, s.group_id, c.course_name
    FROM student s 
    LEFT JOIN course c ON s.course_id = c.course_id
  `;
  db.pool.execute(statement, (error, results) => {
    res.send(utils.createResult(error, results));
  });
});

// Get students by course_id (NEW)
router.get("/studentsByCourse", (req, res) => {
  const { course_id } = req.query;
  if (!course_id) {
    return res.send(utils.createError("Missing course_id query parameter"));
  }
  const statement = `
    SELECT s.student_id, s.first_name, s.last_name, s.email, s.prn_no, s.group_id, c.course_name
    FROM student s
    LEFT JOIN course c ON s.course_id = c.course_id
    WHERE c.course_id = ?
  `;
  db.pool.execute(statement, [course_id], (error, results) => {
    res.send(utils.createResult(error, results));
  });
});

// Student count (existing)
router.get("/studentCount", (req, res) => {
  db.pool.execute(`SELECT COUNT(*) AS count FROM student`, (error, results) => {
    if (error) {
      res.send(utils.createError(error));
    } else {
      res.send(utils.createResult(null, results[0]));
    }
  });
});

// Optional: delete student by id (existing)
router.delete("/deleteStudent/:id", (req, res) => {
  const { id } = req.params;
  db.pool.execute(`DELETE FROM student WHERE student_id = ?`, [id], (error, result) => {
    res.send(utils.createResult(error, result));
  });
});

// Optional: update student details (existing)
router.put("/updateStudent/:id", (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    prn_no,
    group_id,
    course_id,
  } = req.body;

  db.pool.execute(
    `UPDATE student SET first_name=?, last_name=?, email=?, prn_no=?, group_id=?, course_id=? WHERE student_id=?`,
    [first_name, last_name, email, prn_no, group_id, course_id, id],
    (error, result) => {
      res.send(utils.createResult(error, result));
    }
  );
});

module.exports = router;
