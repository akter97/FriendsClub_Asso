const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(__dirname + '/ca.pem') // point to Aiven CA
  }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("MySQL Connected via Pool!");
    connection.release();
  }
});

module.exports = db;