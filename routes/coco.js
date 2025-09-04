const express = require("express");
const db = require("../database");
const config = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const utils = require("../utils")

const router = express.Router();

router.post("/register", (request, response) => {
  const {
    first_name,
    last_name,
    email,
    password,course_name
  } = request.body;
  

  const statementCourseID = `select course_id from course where course_name=?`
     db.pool.execute(statementCourseID,
    [course_name],
    (error, result) => {
   if(error){
    response.send(utils.createError(error))
   }
   else {
  const course_id = result[0].course_id; 
  const statement = `insert into coco
    (first_name,last_name,email,password,course_id)
    values(?,?,?,?,?)`;

  db.pool.execute(
    statement,
    [
      first_name,
      last_name,
      email,
      utils.encryptPassword(password),
      course_id
    ],
    (error, result) => {
      response.send(utils.createResult(error, result));
    }
  );

}
});

});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM coco WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ status: "error", error: "User not found" });
    }

    const user = rows[0];

    console.log(user)
    console.log(utils.encryptPassword(password))
   

  if (utils.encryptPassword(password) !== user.password) {
  return res.status(400).json({ status: "error", error: "Invalid credentials" });
}

    const payload = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,course_id: user.course_id || null, 
      course_id: user.course_id || null 
    };

    // token
    const token = jwt.sign(payload, config.secret, { expiresIn: "1h" });

   res.json({
  status: "success",
  token: token,
  user: rows[0]
});

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

module.exports = router;
