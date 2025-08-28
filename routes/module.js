const express = require("express");
const db = require("../database");
const utils = require("../utils");
const config = require("../config")
const jwt = require('jsonwebtoken')

const router = express.Router();

router.get("/modules", (request,response) => {
    const statement = "SELECT module_id, module_name FROM module";
    db.pool.query(statement, (error, result) => {

      response.send(utils.createResult(error,result)) 

    })
})

module.exports = router;