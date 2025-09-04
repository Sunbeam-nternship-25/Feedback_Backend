const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

router.post("/createFeedback", async (request, response) => {

  const {
    teacher_id,
    module_id,
    module_type_id,
    group_id,
    course_id,
    start_time,
    end_time,
    is_active
  } = request.body;

  
  const statement = `insert into feedback_schedule( teacher_id,
    module_id,
    module_type_id,
    group_id,
    course_id,
    start_time,
    end_time,
    is_active)values (?,?,?,?,?,?,?,?)`;

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
      is_active
    ],
    (error, results) => {
      response.send(utils.createResult(error, results));
    }
  );
  
});

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

router.put("/updateFeedback/:id", async (request, response) => {
      const { id } = request.params
  const {
    teacher_id,
    module_id,
    module_type_id,
    group_id,
    course_id,
    start_time,
    end_time,
  } = request.body;




  const statement = `update feedback_schedule set
  teacher_id = ?,
    module_id =?,
    module_type_id =?,
    group_id =?,
    course_id =?,
    start_time =?,
    end_time  =?
    where feedback_schedule_id =?`;

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
      id
    ],
    (error, results) => {
      response.send(utils.createResult(error, results));
    }
  );
});


router.delete("/deleteFeedback/:id", async (request, response) => {
  const { id } = request.params;

  const statement = `DELETE FROM feedback_schedule WHERE feedback_schedule_id = ?`;

  db.pool.execute(statement, [id], (error, results) => {
    response.send(utils.createResult(error, results));
  });
});

router.get("/studentsFeedbackStatus", (request, response) => {
  const course_id = request.userInfo?.course_id;



  const statement = `
    SELECT s.student_id, s.first_name, s.last_name, s.email, s.course_id, s.group_id,
           CASE WHEN f.feedback_id IS NOT NULL THEN 'Submitted' ELSE 'Not Submitted' END AS feedback_status
    FROM student s
    JOIN feedback_schedule fs 
      ON s.course_id = fs.course_id AND s.group_id = fs.group_id
    LEFT JOIN feedback f 
      ON s.student_id = f.student_id AND f.feedback_schedule_id = fs.feedback_schedule_id
    WHERE s.course_id = ?   -- filter by course, not teacher
  `;

  db.pool.execute(statement, [course_id], (error, result) => {
    if (error) {
      console.error("SQL Error:", error); 
      response.send(utils.createError(error));
    } else {
      const submitted = result.filter(r => r.feedback_status === "Submitted");
      const notSubmitted = result.filter(r => r.feedback_status === "Not Submitted");

      response.send(utils.createResult(null, { submitted, notSubmitted }));
    }
  });
});

module.exports = router;
