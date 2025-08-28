const express = require("express");
const db = require("../database");
const utils = require("../utils");
const config = require("../config");
const jwt = require("jsonwebtoken");

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

router.post("/newRegister", (request, response) => {

    console.log(request.body)
  const {
    first_name,
    last_name,
    email,
    password,
    prn_no,
    course_name,
    group_name,
  } = request.body;

  const statement1 = `SELECT course_id FROM course WHERE course_name = ?`;


  
  db.pool.execute(statement1, [course_name], (error1, result1) => {
    if (error1) {
      return response.send(utils.createError(error1));
    }
    if (result1.length === 0) {
      console.log(result1)
      return response.send(utils.createError("Invalid course name"));
    }

    const course_id = result1[0].course_id;
    console.log(course_id)


    const statement2 = `SELECT group_id FROM course_group WHERE group_name = ?`;
    
    db.pool.execute(statement2, [group_name], (error2, result2) => {
      if (error2) {
        return response.send(utils.createError(error2));
      }
      if (result2.length === 0) {
        return response.send(utils.createError("Invalid group name"));
      }

      const group_id = result2[0].group_id;

     console.log(group_id)

       const statementInsert = `
    INSERT INTO student
    (first_name, last_name, email, password, prn_no, group_id, course_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

      
      db.pool.execute(
        statementInsert,
        [
          first_name,
          last_name,
          email,
          utils.encryptPassword(password),
          prn_no,
          group_id,
          course_id,
        ],
        (error3, result3) => {
          response.send(utils.createResult(error3, result3));
        }
      );
    });
  });
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
                student_id,
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


// Example with Express + MySQL/JWT
router.get("/studentbyid", (request, response) => {
  const student_id = request.userInfo.student_id; // comes from JWT middleware

  const statement = `SELECT * FROM student WHERE student_id = ?`;

  db.pool.execute(statement, [student_id], (error, result) => {
    if (error) {
      response.send(utils.createError(error));
    } else {
      if (result.length === 0) {
        response.send(utils.createError("Student not found"));
      } else {
        response.send(utils.createResult(null, result[0]));
      }
    }
  });
});

module.exports = router;
