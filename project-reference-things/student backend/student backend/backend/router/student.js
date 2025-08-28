const express = require("express");
const db = require("../database");
const utils = require("../utils");
const config = require("../config");
const jwt = require('jsonwebtoken')

const router = express.Router();

router.post("/register", (request, response) => {
  const {
    first_name,
    last_name,
    email,
    password,
    prn_no,
    group_id,
    course_id,
  } = request.body;

  const statement = `insert into student
    (first_name,last_name,email,password,prn_no,group_id,course_id)
    values(?,?,?,?,?,?,?)`;

  db.pool.execute(
    statement,
    [
      first_name,
      last_name,
      email,
      utils.encryptPassword(password),
      prn_no,
      group_id,
      course_id,
    ],
    (error, result) => {
      response.send(utils.createResult(error, result));
    }
  );
});

router.post("/login", (request, response) => {
  const { email, password } = request.body;

  const statement = `select student_id,first_name,last_name, group_id,course_id 
    from student where email = ? and password = ?`;

  db.pool.query(
    statement,
    [email, utils.encryptPassword(password)],
    (error, students) => {
      if (error) {
        response.send(utils.createError(error));
      } else {
        if (students.length == 0) {
          response.send(utils.createError("User does not exist"));
        } else {
          const { student_id, first_name, last_name, group_id, course_id } =
            students[0];

          const payload = {
            student_id,
            first_name,
            last_name,
            group_id,
            course_id,
          };

          try {
            const token = jwt.sign(payload, config.secret);
            response.send(
              utils.createSucess({
                token,
                first_name,
                last_name,
              })
            );
          } catch (ex) {
            response.send(utils.createError(ex));
          }
        }
      }
    }
  );
});

module.exports = router;
