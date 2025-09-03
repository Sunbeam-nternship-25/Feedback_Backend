const express = require("express")
const config = require("../config")
const utils = require ("../utils")
const db = require("../database")
const jwt = require("jsonwebtoken")
const router = express.Router();
 
router.get("/teacher_name", (request, response) => {
  const statement = `
    SELECT teacher_id, CONCAT(first_name, ' ', last_name) AS teacher_name 
    FROM teacher
  `;

  db.pool.query(statement, (error, result) => {
    response.send(utils.createResult(error, result));
  });
});



router.post("/teacherbyid", (request, response) => {
    const { teacher_id } =request.body

    if (!teacher_id) {
        return response.send(utils.createError("Course ID is required"));

    }
    console.log("Requested teacher_id", teacher_id);

    const teacherStatement = `SELECT CONCAT(first_name,' ',last_name) AS teacher_name from teacher where teacher_id=? `

    db.pool.execute(teacherStatement, [teacher_id], (error, teachers) => {
        if(error) {
            console.error("DB Error:", error);
            return response.send(utils.createError(error))

        }
        response.send(utils.createResult(null, teachers))
    })
})

module.exports = router

