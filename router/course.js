const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

// GET all courses (Now returns course_id and course_name!)
router.get("/allCourses", (request, response) => {
  const statement = "SELECT course_id, course_name FROM course";
  db.pool.execute(statement, (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

// GET course by ID
router.get("/allCourses/:course_id", (request, response) => {
  const { course_id } = request.params;
  const statement = "SELECT course_id, course_name FROM course WHERE course_id = ?";
  db.pool.execute(statement, [course_id], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

// CREATE course
router.post("/insertCourse", (request, response) => {
  const { course_name } = request.body;
  const statement = "INSERT INTO course(course_name) VALUES (?)";
  db.pool.execute(statement, [course_name], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

// UPDATE course
router.put("/updateCourse", (request, response) => {
  const { course_id, course_name } = request.body;
  const statement = "UPDATE course SET course_name = ? WHERE course_id = ?";
  db.pool.execute(statement, [course_name, course_id], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

// DELETE course
router.delete("/deleteCourse", (request, response) => {
  const { course_id } = request.body;
  const statement = "DELETE FROM course WHERE course_id = ?";
  db.pool.execute(statement, [course_id], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

module.exports = router;
