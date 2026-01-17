 const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");  
const periodRoutes = require("./routes/period.route");  
const shereMemberRoutes = require('./routes/shereMember.route');
const paymentRoutes = require("./routes/payment.routes");
const app = express();

 app.use((req, res, next) => {
    res.locals.user = req.user || null;  
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/Image/ProfilePicture/'))); 

// ৩. Session Configuration
app.use(session({
    secret: 'friendsclub_secret', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }  
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

//  Routes Setup 
app.use("/", authRoutes);  
app.use("/", userRoutes); 
app.use('/period', periodRoutes);
app.use('/shere_member', shereMemberRoutes);
app.use('/', paymentRoutes);
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

//   Error Handler
app.use((req, res) => {
    res.status(404).render("pages/error/404", {
        title: "Page Not Found",
        hideNavbar: true  
    });
});
app.use(express.static(path.join(__dirname, 'public')));
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // 0.0.0.0 mane holo server-ti local network-er sob IP theke access kora jabe

app.listen(PORT, HOST, () => {
    console.log(`Server running on:`);
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Network: http://[APNAR_IP_ADDRESS]:${PORT}`);
});
module.exports = app;
//computereng2021@gmail.com
//!Q@Wa10)*&