 const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes"); // ইউজার রাউট ইমপোর্ট করুন

const app = express();

// ১. Body Parser (সবার উপরে থাকতে হবে)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ২. Static Files (ছবি দেখার জন্য)
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/Image/ProfilePicture/'))); 

// ৩. Session Configuration
app.use(session({
    secret: 'friendsclub_secret', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // ২৪ ঘণ্টা
}));

// ৪. EJS + Layout setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.set("views", path.join(__dirname, "views"));

// ৫. Authorization Guard
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
};

// ৬. Routes Setup
app.use("/", authRoutes); // লগইন/রেজিস্ট্রেশন রাউট
app.use("/", userRoutes); // আপনার ইউজার ম্যানেজমেন্ট রাউট (যেখানে /users আছে)

// Dashboard
app.get("/dashboard", isAuth, (req, res) => {
    res.render("pages/dashboard", { 
        title: "Dashboard Page",
        user: req.session.user,
        hideNavbar: false 
    });
});

// Root Redirect
app.get("/", (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect("/dashboard");
    } else {
        res.redirect("/login");
    }
});

// ৭. ৪0৪ Error Handler
app.use((req, res) => {
    res.status(404).render("pages/error/404", {
        title: "Page Not Found",
        hideNavbar: true  
    });
});
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
//computereng2021@gmail.com
//!Q@Wa10)*&