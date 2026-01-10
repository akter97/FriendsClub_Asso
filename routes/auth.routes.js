const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

// --- Route Protection Middleware ---
// Ei function-ti index.js thekeo ana jay, ba ekhaneo likha jay
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next(); // Login thakle porer step-e jao
    } else {
        res.redirect("/login"); // Login na thakle login page-e pathao
    }
};

// --- Public Routes ---
// Ei page gulo sobai dekhte parbe
router.get("/login", controller.loginPage);
router.post("/login", controller.login);

// --- Protected Routes (Authorization) ---
// Ei route gulo te 'isAuth' middleware add kora hoyeche
router.get("/dashboard", isAuth, controller.getDashboard);
router.get("/users", isAuth, controller.getUsers);

// Logout route
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;