 const mysql = require("mysql");
 
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",     
  database: "friendsclub"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("MySQL connected");
});

// লগইন চেক করার লজিক
exports.loginUser = (email, password, callback) => {
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], callback);
};

// সকল ইউজার তুলে আনার লজিক
exports.getAllUsers = (callback) => {
  const query = "SELECT * FROM users ORDER BY id DESC";
  db.query(query, callback);
};

// নতুন ইউজার অ্যাড করার সঠিক লজিক (Stored Procedure দিয়ে)
 exports.addUser = (user, callback) => {
  const sql = `
    CALL sp_add_user(
      ?,?,?,?,?,?,?,?,?,?,?,?
    )
  `;

  const params = [
    user.roleId,
    user.name,
    user.email,
    user.password,
    user.MemberCode,
    user.FathersName,
    user.MothersName,
    user.MobileNo,
    user.PassportNo,
    user.Organization,
    user.PresentAddress,
    user.Picture
  ];

  db.query(sql, params, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
