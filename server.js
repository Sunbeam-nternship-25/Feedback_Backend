const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("./config");
const utils = require("./utils");
const cors = require("cors");
const app = express();


app.use(cors())
app.use(express.json());
app.use(express.urlencoded());



app.use((request, response, next) => {
  if (request.url == "/student/login" || request.url == "/student/newRegister" 
     ||  request.url == "/group/groupbycourse/course_name" || request.url == "/course/allCourses") {
    next();
  } else {
    let token = request.headers["authorization"];
    if (!token) {
      response.send(utils.createError("token is missing"));
      return;
    }

    token = token.replace("Bearer", "").trim();

    try {
      if (jwt.verify(token, config.secret)) {
        const payload = jwt.decode(token);
        request["userInfo"] = payload;
        next();
      } else {
        response.send(utils.createError("Invalid token"));
      }
    } catch (ex) {
      response.send(utils.createError("Invalid token"));
    }
  }
});



const studentRouter = require("./router/student");
const feedbackRouter = require("./router/feedback")
const courseRouter = require("./router/course")
const groupRouter= require("./router/group")




app.use("/student", studentRouter);
app.use("/feedback",feedbackRouter)
app.use("/course" , courseRouter)
app.use("/group",groupRouter)


app.listen(4000, "0.0.0.0", () => {
  console.log("server is running on port 4000");
});
