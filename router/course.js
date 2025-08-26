const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();



router.get("/allCourses",(request,response)=>{

    const statement =  `select course_name from course`

    db.pool.execute(statement,(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})



router.get("/allCourses/:course_id", (request, response) => {
  const { course_id } = request.params;   

  const statement = `SELECT course_name FROM course WHERE course_id = ?`;

  db.pool.execute(statement, [course_id], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});



router.post("/insertCourse",(request,response)=>{
      
    const {course_name }= request.body 

    const statement =  `insert into course(course_name)values (?)`



    db.pool.execute(statement,[course_name],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})




router.put("/updateCourse",(request,response)=>{
    const {course_id,course_name}= request.body

    const statement =  `update course set course_name = ? where course_id = ?
    `

    db.pool.execute(statement,[course_name,course_id],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})




router.delete("/deleteCourse",(request,response)=>{


     const {course_id}= request.body
    const statement =  `delete from course where course_id = ?`

    db.pool.execute(statement,[course_id],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})


module.exports=router;