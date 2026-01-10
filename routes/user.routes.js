const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

// --- Route Protection Guard ---
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next(); // Login thakle controller-e jete dao
    } else {
        res.redirect("/login"); // Login na thakle login page-e firot pathao
    }
};

// --- Protected Routes ---
// Ekhon login chara keu users list dekhte parbe na
router.get("/users", isAuth, controller.getUsers);

// Login chara keu users add korte parbe na
router.post("/users", isAuth, controller.addUser);

module.exports = router;