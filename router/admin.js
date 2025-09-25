const express = require("express");
const db = require("../database");
const utils = require("../utils");
const config = require("../config");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (request, response) => {
  const { email, password } = request.body;

  const statement = `select admin_id
    from admin where email = ? and password = ?`;

  db.pool.query(statement, [email, password], (error, admins) => {
    if (error) {
      response.send(utils.createError(error));
    } else {
      if (admins.length == 0) {
        response.send(utils.createError("User does not exist"));
      } else {
        console.log(admins);
        const { admin_id, email } = admins[0];

        const payload = {
          admin_id,
          email,
        };

        try {
          const token = jwt.sign(payload, config.secret);
          response.send(
            utils.createSucess({
              token,
              admin_id,
              email,
            })
          );
        } catch (ex) {
          response.send(utils.createError(ex));
        }
      }
    }
  });
});




module.exports = router;
