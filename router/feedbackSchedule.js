const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

router.post("/createFeedback", (request, response) => {
  const {
    teacher_id,
    module_id,
    module_type_id,
    group_id,
    course_id,
    start_time,
    end_time,
  } = request.body;

  const statement = `insert into feedback_schedule( teacher_id,
    module_id,
    module_type_id,
    group_id,
    course_id,
    start_time,
    end_time)values (?,?,?,?,?,?,?)`;

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
    ],
    (error, results) => {
      response.send(utils.createResult(error, results));
    }
  );
});

router.get("/activeFeedback", (request, response) => {
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


router.get("/deActiveFeedback", (request, response) => {
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

router.put("/updateFeedback/:id", (request, response) => {
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


router.delete("/deleteFeedback/:id", (request, response) => {
      const { id } = request.params
  


  const statement = `delete feedback_schedule
    where feedback_schedule_id =?`;

  db.pool.execute(
    statement,
      id,
    (error, results) => {
      response.send(utils.createResult(error, results));
    }
  );
});




module.exports = router;