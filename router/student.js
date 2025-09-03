const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();



// Fetch all students for admin
router.get("/allStudents", (req, res) => {
  db.pool.execute(`SELECT student_id, first_name, last_name, email, prn_no, group_id, course_id FROM student`, (error, results) => {
    res.send(utils.createResult(error, results));
  });
});

// Get total student count
router.get("/studentCount", (req, res) => {
  db.pool.execute(`SELECT COUNT(*) AS count FROM student`, (error, results) => {
    if (error) {
      res.send(utils.createError(error));
    } else {
      res.send(utils.createResult(null, results[0]));
    }
  });
});

// Optional: delete student by id
router.delete("/deleteStudent/:id", (req, res) => {
  const { id } = req.params;
  db.pool.execute(`DELETE FROM student WHERE student_id = ?`, [id], (error, result) => {
    res.send(utils.createResult(error, result));
  });
});

// Optional: update student details
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