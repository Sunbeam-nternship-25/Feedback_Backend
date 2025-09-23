const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

// Get all modules with course names (includes modules without matching course)
router.get("/allModules", (req, res) => {
  const statement = `
    SELECT module.module_id, module.module_name, course.course_name, course.course_id
    FROM module
    LEFT JOIN course ON module.course_id = course.course_id
  `;
  db.pool.execute(statement, (error, results) => {
    res.send(utils.createResult(error, results));
  });
});

// Get modules filtered by course_name (use LEFT JOIN to be safe)
router.get("/allModulesbyCourse/:course_name", (req, res) => {
  const { course_name } = req.params;
  const statement = `
    SELECT module.module_id, module.module_name, course.course_name, course.course_id
    FROM module
    LEFT JOIN course ON module.course_id = course.course_id
    WHERE course.course_name = ?
  `;
  db.pool.execute(statement, [course_name], (error, results) => {
    res.send(utils.createResult(error, results));
  });
});

// Insert new module
router.post("/insertModule", (req, res) => {
  const { module_name, course_id } = req.body;

  const statement = `INSERT INTO module (module_name, course_id) VALUES (?, ?)`;

  db.pool.execute(statement, [module_name, course_id], (error, result) => {
    res.send(utils.createResult(error, result));
  });
});

// Update existing module
router.put("/updateModule", (req, res) => {
  const { module_name, module_id, course_id } = req.body;

  const statement = `UPDATE module SET module_name = ?, course_id = ? WHERE module_id = ?`;

  db.pool.execute(statement, [module_name, course_id, module_id], (error, result) => {
    res.send(utils.createResult(error, result));
  });
});

// Delete module
router.delete("/deleteModule", (req, res) => {
  const { module_id } = req.body;

  const statement = `DELETE FROM module WHERE module_id = ?`;

  db.pool.execute(statement, [module_id], (error, result) => {
    res.send(utils.createResult(error, result));
  });
});

module.exports = router;
