const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

router.get("/groupbycourse/:course_name", (request, response) => {
  const { course_name } = request.params;

  console.log(course_name);

  const statement = `select course_id from course where course_name=?`;

  db.pool.execute(statement, [course_name], (error, result) => {
    if (error) {
      response.send(utils.createError(error));
    } else {
      console.log(result);
      const course_id = result[0].course_id;
      console.log(course_id);
      const groupstatement = `select group_name from course_group where course_id =?`;
      db.pool.execute(groupstatement, [course_id], (error, result) => {
        response.send(utils.createResult(error, result));
      });
    }
  });
});

router.get("/allCourseGroup", (request, response) => {
  const statement = `select group_name from course_group`;

  db.pool.execute(statement, (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

router.post("/insertCourse", (request, response) => {
  const { group_name, course_name } = request.body;

  const selectStatement = `select course_id from course where course_name=?`;

  db.pool.execute(selectStatement, [course_name], (error, result) => {
    if (error) {
      response.send(utils.createError(error));
    } else {
      const course_id = result[0].course_id;
      const statement = `insert into course_group(group_name,course_id)values (?,?) `;

      db.pool.execute(statement, [group_name, course_id], (error, result) => {
        response.send(utils.createResult(error, result));
      });
    }
  });
});

router.put("/updateCourseGroup", (request, response) => {
  const { group_name, group_id } = request.body;

  const statement = `update course_group set group_name = ? where group_id = ?
    `;

  db.pool.execute(statement, [group_name, group_id], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

router.delete("/deleteCourseGroup", (request, response) => {
  const { group_id } = request.body;
  const statement = `delete from course_group where group_id = ?`;

  db.pool.execute(statement, [group_id], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

module.exports = router;
