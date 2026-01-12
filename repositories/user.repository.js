const db = require("../config/db");  

// Login User
exports.loginUser = (email, password, callback) => {
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], callback);
};

// Get All Users
exports.getAllUsers = (callback) => {
  const query = "SELECT * FROM users ORDER BY id DESC";
  db.query(query, callback);
};

// Add User (Using Stored Procedure)
exports.addUser = (user, callback) => {
  const sql = `CALL sp_add_user(?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [
    user.roleId, user.name, user.email, user.password,
    user.MemberCode, user.FathersName, user.MothersName,
    user.MobileNo, user.PassportNo, user.Organization,
    user.PresentAddress, user.Picture
  ];
  db.query(sql, params, callback);
};

// Update User (Using Stored Procedure)
exports.updateUser = (user, callback) => {
  const sql = `CALL sp_update_user(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [
    user.id, user.roleId, user.name, user.email, user.password,
    user.MemberCode, user.FathersName, user.MothersName,
    user.MobileNo, user.PassportNo, user.Organization,
    user.PresentAddress, user.Picture
  ];
  db.query(sql, params, callback);
};