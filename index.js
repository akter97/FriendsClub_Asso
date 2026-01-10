 const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session"); // ১. Session import
const authRoutes = require("./routes/auth.routes");

const app = express();

// ২. Session Configuration (অবশ্যই Body Parser এর নিচে দিবেন)
app.use(session({
    secret: 'friendsclub_secret', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // ২৪ ঘণ্টা
}));

// ৩. Authorization Guard (isAuth Middleware)
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next(); // Login thakle dashboard-e jete dao
    } else {
        res.redirect("/login"); // Login na thakle login page-e firot pathao
    }
};

// EJS + Layout setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.set("views", path.join(__dirname, "views"));
// image

app.use('/public', express.static('public'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ৪. Protected Route (Login chara keu dhukte parbe na)
app.use("/", authRoutes);
 app.get("/dashboard", isAuth, (req, res) => {
    res.render("pages/dashboard", { 
        title: "Dashboard Page", // layout.ejs e jodi <%= title %> thake
        user: req.session.user,  // layout.ejs e jodi <%= user %> thake
        hideNavbar: false 
    });
});

// Normal Routes (Login/Register)
app.get("/", (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect("/dashboard");
    } else {
        res.redirect("/login");
    }
});

app.use((req, res) => {
    res.status(404).render("pages/error/404", {
        title: "Page Not Found",
        hideNavbar: true  
    });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//computereng2021@gmail.com
//!Q@Wa10)*&