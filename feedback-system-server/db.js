const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Krisha@2910', 
    database: 'feedback_system_db'
});
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});
module.exports = db;
