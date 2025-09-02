const express = require("express");
const db = require("../database");

const router = express.Router();

// Create new feedback schedule
router.post("/createFeedback", (req, res) => {
  const {
    teacher_id,
    module_id,
    module_type_id,
    group_id,
    course_id,
    start_time,
    end_time,
  } = req.body;

  const statement = `
    INSERT INTO feedback_schedule
      (teacher_id, module_id, module_type_id, group_id, course_id, start_time, end_time)
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
  `;

  db.pool.execute(
    statement,
    [teacher_id, module_id, module_type_id, group_id, course_id, start_time, end_time],
    (error, results) => {
      if (error) {
        console.error("Error inserting feedback:", error);
        res.status(500).json({ error: error.message });
      } else {
        res.json({ success: true, data: results });
      }
    }
  );
});

// Get active feedback schedules
router.get("/activeFeedback", (req, res) => {
  const statement = `
    SELECT 
      fs.feedback_schedule_id,
      teacher.first_name,
      teacher.last_name,
      module.module_name,
      module_type.module_type_name,
      course_group.group_name,
      course.course_name,
      fs.start_time,
      fs.end_time
    FROM feedback_schedule fs
    INNER JOIN teacher ON fs.teacher_id = teacher.teacher_id
    INNER JOIN module ON fs.module_id = module.module_id
    INNER JOIN module_type ON fs.module_type_id = module_type.module_type_id
    INNER JOIN course_group ON fs.group_id = course_group.group_id
    INNER JOIN course ON fs.course_id = course.course_id
    WHERE fs.is_active = 1
  `;

  db.pool.execute(statement, (error, results) => {
    if (error) {
      console.error("Error fetching active feedback:", error);
      res.status(500).json({ error: error.message });
    } else {
      res.json({ success: true, data: results });
    }
  });
});

// Get inactive feedback schedules
router.get("/deActiveFeedback", (req, res) => {
  const statement = `
    SELECT 
      fs.feedback_schedule_id,
      teacher.first_name,
      teacher.last_name,
      module.module_name,
      module_type.module_type_name,
      course_group.group_name,
      course.course_name,
      fs.start_time,
      fs.end_time
    FROM feedback_schedule fs
    INNER JOIN teacher ON fs.teacher_id = teacher.teacher_id
    INNER JOIN module ON fs.module_id = module.module_id
    INNER JOIN module_type ON fs.module_type_id = module_type.module_type_id
    INNER JOIN course_group ON fs.group_id = course_group.group_id
    INNER JOIN course ON fs.course_id = course.course_id
    WHERE fs.is_active = 0
  `;

  db.pool.execute(statement, (error, results) => {
    if (error) {
      console.error("Error fetching inactive feedback:", error);
      res.status(500).json({ error: error.message });
    } else {
      res.json({ success: true, data: results });
    }
  });
});

// Update feedback schedule
router.put("/updateFeedback/:id", (req, res) => {
  const { id } = req.params;
  const {
    teacher_id,
    module_id,
    module_type_id,
    group_id,
    course_id,
    start_time,
    end_time,
  } = req.body;

  const statement = `
    UPDATE feedback_schedule SET
      teacher_id = ?,
      module_id = ?,
      module_type_id = ?,
      group_id = ?,
      course_id = ?,
      start_time = ?,
      end_time = ?
    WHERE feedback_schedule_id = ?
  `;

  db.pool.execute(
    statement,
    [
      teacher_id,
      module_id,
      module_type_id,
      group_id,
      course_id,
      start_time,
      end_time,
      id,
    ],
    (error, results) => {
      if (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ error: error.message });
      } else {
        res.json({ success: true, data: results });
      }
    }
  );
});

// Delete feedback schedule
router.delete("/deleteFeedback/:id", (req, res) => {
  const { id } = req.params;

  const statement = "DELETE FROM feedback_schedule WHERE feedback_schedule_id = ?";

  db.pool.execute(statement, [id], (error, results) => {
    if (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ error: error.message });
    } else {
      res.json({ success: true, data: results });
    }
  });
});

module.exports = router;