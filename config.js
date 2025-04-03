const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'maintenance_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

module.exports = db;