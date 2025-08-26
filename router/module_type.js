const express = require("express");
const db = require("../database");
const utils = require("../utils");

const router = express.Router();



router.get("/allModulesType",(request,response)=>{

    const statement =  `select module_type_name from module_type`;

    db.pool.execute(statement,(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})



router.post("/insertModule",(request,response)=>{
      
    const {module_type_name}= request.body 

    const statement =  `insert into module_type(module_type_name)values (?)`

    db.pool.execute(statement,[module_type_name],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})




router.put("/updateModule",(request,response)=>{
      const {module_type_name,module_type_id}= request.body 

    const statement =  `update module_type set module_type_name = ? where module_type_id =?
    `

    db.pool.execute(statement,[module_type_name,module_type_id],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})




router.delete("/deleteModule",(request,response)=>{


     const {module_type_id}= request.body
    const statement =  `delete from module_type where module_type_id = ?`

    db.pool.execute(statement,[module_type_id],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})


module.exports=router;