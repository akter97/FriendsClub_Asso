const repo = require("../repositories/user.repository");

// Render login page
exports.loginPage = (req, res) => {
  res.render("pages/login", { title: "Login", error: null, hideNavbar: true });
};

// Handle login
exports.login = (req, res) => {
  const { email, password } = req.body;

  repo.loginUser(email, password, (err, user) => {
    if (err) {
      console.error(err);
      return res.render("pages/login", {
        title: "Login",
        error: "Database error occurred",
        hideNavbar: true
      });
    }

    if (!user || user.length === 0) {
      return res.render("pages/login", {
        title: "Login",
        error: "Invalid Email or Password",
        hideNavbar: true
      });
    }

    // --- MUST ADD THIS FOR AUTHORIZATION ---
    // Session-e data save kora jate server mone rakhte pare
    req.session.isLoggedIn = true; 
    req.session.user = user[0]; // database theke pawa user data store korlam

    // Success → redirect to dashboard
    res.redirect("/dashboard");
  });
};

// Dashboard page
exports.getDashboard = (req, res) => {
  // Session theke user data niye dashboard-e pathano
  res.render("pages/dashboard", { 
    title: "Dashboard", 
    user: req.session.user, // Ekhon apni dashboard-e <%= user.name %> likhte parben
    hideNavbar: false 
  });
};

// Users page
exports.getUsers = (req, res) => {
  repo.getAllUsers((err, users) => {
    if (err) return res.send("Database error");
    res.render("pages/users", { title: "Users", users, hideNavbar: false });
  });
};