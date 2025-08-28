const express = require("express");
const db = require("../database");
const utils = require("../utils");


const router = express.Router();


router.get("/allCourses" ,(request,response) =>{
    
    const statemet =  `select course_name from course`;

    db.pool.execute (statemet,(error,result) => {
        response.send(utils.createResult(error,result))
})

})

module.exports = router