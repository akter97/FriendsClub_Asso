const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const upload = require('../middlewares/upload');
// --- Route Protection Guard ---
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();  
    } else {
        res.redirect("/login"); 
    }
};

// --- Protected Routes --- 
router.get("/users", isAuth, controller.getUsers); 
router.post(
  '/users',
  upload.single('Picture'),
  controller.addUser
);

router.post('/update', upload.single('Picture'), controller.updateUser); 
module.exports = router;