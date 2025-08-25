const express = require("express");
const db = require("../database");
const utils = require("../utils");
const config = require("../config");
const jwt = require('jsonwebtoken')

const router = express.Router();

//get all courses
router.get("/courses", (request,response) => {
  const statement = "SELECT course_id, course_name FROM course";
  db.pool.query(statement, (error, result) => {
    response.send(utils.createResult(error,result));
  })
})


module.exports = router;