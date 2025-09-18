const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

router.get("/activeFeedback", async (request, response) => {
  const statement = `
  SELECT 
    teacher.first_name,
    teacher.last_name,
    module.module_name,
    module_type.module_type_name,
    course_group.group_name,
    course.course_name
  FROM feedback_schedule
  INNER JOIN teacher ON feedback_schedule.teacher_id = teacher.teacher_id
  INNER JOIN module ON feedback_schedule.module_id = module.module_id
  INNER JOIN module_type ON feedback_schedule.module_type_id = module_type.module_type_id
  INNER JOIN course_group ON feedback_schedule.group_id = course_group.group_id
  INNER JOIN course ON feedback_schedule.course_id = course.course_id 
  where  is_active = 1;
 
`;

  db.pool.execute(statement, (error, results) => {
    response.send(utils.createResult(error, results));
  });
});


router.get("/deActiveFeedback", async (request, response) => {
  const statement = `
  SELECT 
    teacher.first_name,
    teacher.last_name,
    module.module_name,
    module_type.module_type_name,
    course_group.group_name,
    course.course_name
  FROM feedback_schedule
  INNER JOIN teacher ON feedback_schedule.teacher_id = teacher.teacher_id
  INNER JOIN module ON feedback_schedule.module_id = module.module_id
  INNER JOIN module_type ON feedback_schedule.module_type_id = module_type.module_type_id
  INNER JOIN course_group ON feedback_schedule.group_id = course_group.group_id
  INNER JOIN course ON feedback_schedule.course_id = course.course_id 
  where  is_active = 0;
 
`;

  db.pool.execute(statement, (error, results) => {
    response.send(utils.createResult(error, results));
  });
});




// To get data of FeedbackSchedule for Teacher 
router.get("/feedbackSchedules", (req, res) => {
  const statement = `
  SELECT 
  fs.feedback_schedule_id,
  CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
  m.module_name,
  fs.group_id,
  fs.start_time,
  fs.end_time,
  fs.is_active AS status
FROM feedback_schedule fs
JOIN teacher t ON fs.teacher_id = t.teacher_id
JOIN module m ON fs.module_id = m.module_id
ORDER BY teacher_name, fs.start_time;


  `;

  db.pool.execute(statement, [], (error, result) => {
    if (error) {
      console.error("SQL Error:", error);
      res.send(utils.createError(error));
    } else {
      res.send(utils.createResult(null, result));
    }
  });
});


// Get all schedules
router.get("/feedbackSchedules", (req, res) => {
  const statement = `
    SELECT feedback_schedule_id, teacher_id, module_id, module_type_id, group_id, start_time, end_time, is_active
    FROM feedback_schedule
  `;
  db.pool.execute(statement, [], (error, result) => {
    if (error) res.send(utils.createError(error));
    else res.send(utils.createResult(null, result));
  });
});

// Update status (active/deactive)
router.put("/feedbackSchedule/status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "Active" or "Inactive"

  const statement = `UPDATE feedback_schedule SET is_active = ? WHERE feedback_schedule_id = ?`;
  db.pool.execute(statement, [status, id], (error, result) => {
    if (error) res.send(utils.createError(error));
    else res.send(utils.createResult(null, result));
  });
});


router.get("/feedbackSchedule/:id/students", async (req, res) => {
  try {
    const scheduleId = req.params.id;

    // 🔹 Get all students linked to this schedule (by course/group/module/etc.)
    const [allStudents] = await db.query(
      `SELECT s.student_id, s.first_name, s.last_name, s.email
       FROM students s
       INNER JOIN student_group sg ON s.group_id = sg.group_id
       INNER JOIN feedback_schedule fs ON sg.group_id = fs.group_id
       WHERE fs.feedback_schedule_id = ?`,
      [scheduleId]
    );

    // 🔹 Get students who have submitted feedback for this schedule
    const [submittedStudents] = await db.query(
      `SELECT DISTINCT s.student_id, s.first_name, s.last_name, s.email
       FROM feedback f
       INNER JOIN students s ON f.student_id = s.student_id
       WHERE f.feedback_schedule_id = ?`,
      [scheduleId]
    );

    // Create a set of submitted IDs
    const submittedIds = new Set(submittedStudents.map(s => s.student_id));

    // Separate submitted and notSubmitted
    const submitted = submittedStudents;
    const notSubmitted = allStudents.filter(s => !submittedIds.has(s.student_id));

    res.send({
      status: "success",
      data: { submitted, notSubmitted }
    });

  } catch (err) {
    console.error("Error fetching student status:", err);
    res.status(500).send({ status: "error", error: "Database query failed" });
  }
});


router.put("/feedbackSchedule/:id", async (req, res) => {
  const scheduleId = req.params.id;
  const { start_time, end_time } = req.body;
  await db.query(
    "UPDATE feedback_schedule SET start_time=?, end_time=? WHERE feedback_schedule_id=?",
    [start_time, end_time, scheduleId]
  );
  res.send({ status: "success" });
});


router.get("/:id/students", async (req, res) => {
  const scheduleId = req.params.id;

  try {
    // 1Students who submitted feedback
    const [submitted] = await db.query(
      `SELECT DISTINCT s.student_id, s.first_name, s.last_name, s.email
       FROM student s
       INNER JOIN feedback f 
         ON f.student_id = s.student_id
       WHERE f.feedback_schedule_id = ?`,
      [scheduleId]
    );

    // 2️⃣ Students who did not submit feedback
    const [notSubmitted] = await db.query(
      `SELECT s.student_id, s.first_name, s.last_name, s.email
       FROM student s
       WHERE s.group_id = (
         SELECT group_id FROM feedback_schedule WHERE feedback_schedule_id = ?
       )
       AND s.student_id NOT IN (
         SELECT student_id FROM feedback WHERE feedback_schedule_id = ?
       )`,
      [scheduleId, scheduleId]
    );

    res.send({
      status: "success",
      data: { submitted, notSubmitted },
    });
  } catch (err) {
    console.error("SQL ERROR:", err);
    res
      .status(500)
      .send({ status: "error", error: err.sqlMessage || "Database query failed" });
  }
});


module.exports = router;
