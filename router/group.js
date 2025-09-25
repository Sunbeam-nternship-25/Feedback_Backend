const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();

router.get("/allGroup", (request, response) => {
  const statemet = `select group_name from course_group`;

  db.pool.execute(statemet, (error, result) => {
    response.send(utils.createResult(error, result));
  });
});


router.post("/groupbycourse/course_name", (request, response) => {
  const { course_name } = request.body;

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

module.exports = router;
