const express = require("express");
const db = require("../database");
const utils = require("../utils");
const config = require("../config");



const router = express.Router();

router.post('/fillFeedback', (request, response) => {
    const { q1, q2, q3, q4, q5, suggestion } = request.body;
    const studentId = request.userInfo.student_id;

    

    const insertQuestion = `
        INSERT INTO question(q1, q2, q3, q4, q5, suggestion)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.pool.execute(insertQuestion, [q1, q2, q3, q4, q5, suggestion], (error, result) => {
        if (error) return response.send(utils.createError(error));

        const questionId = result.insertId;

        const getTeacher = `
            SELECT fs.teacher_id, fs.feedback_schedule_id
            FROM feedback_schedule fs
            JOIN student s ON s.group_id = fs.group_id 
                          AND s.course_id = fs.course_id
            WHERE s.student_id = ? 
              AND fs.is_active = 1
        `;

        db.pool.execute(getTeacher, [studentId], (error, teacherRows) => {
            if (error) return response.send(utils.createError("No feedback schedule"));
            if (teacherRows.length === 0) {
                return response.send(utils.createError("No teacher found for this student"));
            }

            const teacherId = teacherRows[0].teacher_id;
            const feedbackScheduleId = teacherRows[0].feedback_schedule_id;

            const insertFeedback = `
                INSERT INTO feedback(student_id, feedback_schedule_id, question_id)
                VALUES (?, ?, ?)
            `;
            db.pool.execute(insertFeedback, [studentId, feedbackScheduleId, questionId], (error, feedbackResult) => {
               response.send(utils.createSucess(error,feedbackResult))
            });
        });
    });
});


<<<<<<< HEAD
=======
router.post('/fillFeedback2', (request, response) => {
    const { q1, q2, q3, q4, q5, suggestion } = request.body;
    const studentId = request.userInfo.student_id;

    const insertQuestion = `
        INSERT INTO question(q1, q2, q3, q4, q5, suggestion)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.pool.execute(insertQuestion, [q1, q2, q3, q4, q5, suggestion], (error, result) => {
        if (error) return response.send(utils.createError(error));

        const questionId = result.insertId;

        const getTeacher = `
            SELECT fs.teacher_id, fs.feedback_schedule_id
            FROM feedback_schedule fs
            JOIN student s ON s.group_id = fs.group_id 
                          AND s.course_id = fs.course_id
            WHERE s.student_id = ? 
              AND fs.is_active = 1
        `;

        db.pool.execute(getTeacher, [studentId], (error, teacherRows) => {
            if (error) return response.send(utils.createError("No feedback schedule"));
            if (teacherRows.length === 0) {
                return response.send(utils.createError("No teacher found for this student"));
            }

            const teacherId = teacherRows[0].teacher_id;
            const feedbackScheduleId = teacherRows[0].feedback_schedule_id;

            // ✅ Step 1: Check if student already submitted feedback
            const checkFeedback = `
                SELECT * FROM feedback 
                WHERE student_id = ? AND feedback_schedule_id = ?
            `;
            db.pool.execute(checkFeedback, [studentId, feedbackScheduleId], (error, rows) => {
                if (error) return response.send(utils.createError(error));

                if (rows.length > 0) {
                    // Already submitted feedback
                    return response.send(utils.createError("You have already submitted feedback."));
                }

                // ✅ Step 2: Insert new feedback
                const insertFeedback = `
                    INSERT INTO feedback(student_id, feedback_schedule_id, question_id)
                    VALUES (?, ?, ?)
                `;
                db.pool.execute(insertFeedback, [studentId, feedbackScheduleId, questionId], (error, feedbackResult) => {
                    if (error) return response.send(utils.createError(error));
                    response.send(utils.createSucess(error, feedbackResult));
                });
            });
        });
    });
});


router.get('/checkFeedback', (request, response) => {
    const studentId = request.userInfo.student_id;

    const checkFeedback = `
        SELECT  fs.feedback_schedule_id, fs.is_active
        FROM feedback_schedule fs
        LEFT JOIN feedback f 
          ON f.feedback_schedule_id = fs.feedback_schedule_id 
         AND f.student_id = ?
        WHERE fs.is_active = 1
        LIMIT 1
    `;

      

    db.pool.execute(checkFeedback, [studentId], (error, rows) => {
        if (error) return response.send(utils.createError(error));

        if (rows.length === 0) {
          console.log(rows)
            // no active feedback schedule for this student
            return response.send(utils.createSucess({ submitted: false, active: false }));
        }

        const feedbackRow = rows[0];
        const submitted = feedbackRow.feedback_id != null; // means student already gave feedback

        return response.send(
            utils.createSucess({
                submitted: submitted, // true/false
                active: feedbackRow.is_active === 1 // active status of schedule
            })
        );
    });
});  



>>>>>>> bac2c09 (Student Backend all apis completed)
router.get("/activeFeedback", (request, response) => {
  // Extract student info from token payload
  const { group_id, course_id } = request.userInfo;

  const statement = `
    SELECT 
      teacher.first_name,
      teacher.last_name,
      module.module_name,
      module_type.module_type_name,
      course_group.group_name,
      course.course_name
    FROM feedback_schedule
    INNER JOIN teacher ON feedback_schedule.teacher_id = teacher.teacher_id
    INNER JOIN module ON feedback_schedule.module_id = module.module_id
    INNER JOIN module_type ON feedback_schedule.module_type_id = module_type.module_type_id
    INNER JOIN course_group ON feedback_schedule.group_id = course_group.group_id
    INNER JOIN course ON feedback_schedule.course_id = course.course_id 
    WHERE feedback_schedule.is_active = 1
    AND feedback_schedule.group_id = ?
    AND feedback_schedule.course_id = ?;
  `;

  db.pool.execute(statement, [group_id, course_id], (error, results) => {
    if (error) {
      response.send(utils.createError(error));
    } else if (results.length === 0) {
      response.send(utils.createError("No active feedback schedule found for this student"));
    } else {
      response.send(utils.createResult(null, results));
    }
  });
});






module.exports = router;  // Export the router to use it in other files