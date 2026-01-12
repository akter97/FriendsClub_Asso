const mysql = require('mysql2'); // অথবা 'mysql'
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "friendsclub",
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0
});

 
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("MySQL Connected via Pool");
    connection.release(); 
  }
});

module.exports = db;