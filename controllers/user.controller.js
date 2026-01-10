const User = require("../models/user.model");
const repo = require("../repositories/user.repository");

// All Users Dekhar Jonno logic
exports.getUsers = (req, res) => {
  // ১. Prothome check korbe user login ki na
  if (!req.session.isLoggedIn) {
    return res.redirect("/login"); // Login na thakle login page-e pathabe
  }

  repo.getAllUsers((err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error");
    }
    // Dashboard ba onno page theke user list render kora
    res.render("pages/users", { 
        users: result, 
        title: "User List", 
        user: req.session.user, // Login kora user-er info
        hideNavbar: false 
    });
  });
};

// Notun User Add Korar Logic
exports.addUser = (req, res) => {
  // ২. Security Check: Login chara user add korte dibe na
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  const user = new User(req.body.name, req.body.email);
  repo.createUser(user, err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Could not create user");
    }
    res.redirect("/users");
  });
};