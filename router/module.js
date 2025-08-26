const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();



router.get("/allModules",(request,response)=>{

    const statement =  `select module_name ,course_name from 
    module INNER JOIN course on module.course_id = course.course_id`;

    db.pool.execute(statement,(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})



router.get("/allModulesbyCourse/:course_name",(request,response)=>{

    const{course_name} = request.params
    console.log(course_name)

    const statement =  `select module_name from 
    module INNER JOIN course on module.course_id = course.course_id 
    where course_name =?`;

    db.pool.execute(statement,[course_name],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})






router.post("/insertModule",(request,response)=>{
      
    const {module_name}= request.body 

    const statement =  `insert into module(module_name)values (?)`

    db.pool.execute(statement,[module_name],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})




router.put("/updateModule",(request,response)=>{
      const {module_name,module_id}= request.body 

    const statement =  `update module set module_name = ? where module_id =?
    `

    db.pool.execute(statement,[module_name,module_id],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})




router.delete("/deleteModule",(request,response)=>{


     const {module_id}= request.body
    const statement =  `delete from module where module_id = ?`

    db.pool.execute(statement,[module_id],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})


module.exports=router;