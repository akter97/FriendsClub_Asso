const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",    // আপনার MySQL password
  database: "friendsclub"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

exports.loginUser = (email, password, callback) => {
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], callback);
};

exports.getAllUsers = (callback) => {
  const query = "SELECT * FROM users";
  db.query(query, callback);
};
