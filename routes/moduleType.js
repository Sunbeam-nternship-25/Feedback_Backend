const express = require("express");
const db = require("../database");
const utils = require("../utils");
const config = require("../config");
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get("/module_types", (request,response) => {
    const statement = "SELECT module_type_id, module_type_name from module_type";

    db.pool.query(statement, (error, result) => {
        response.send(utils.createResult(error,result))
})
})

module.exports = router
