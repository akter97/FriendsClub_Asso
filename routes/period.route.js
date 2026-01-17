const express = require('express');
const router = express.Router();
const periodController = require('../controllers/period.controller'); 
 
// --- Route Protection Guard ---
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();  
    } else {
        res.redirect("/login"); 
    }
};
   

// Period page render
router.get('/', isAuth,periodController.getPeriodPage); 

// Form submit handle
router.post('/add',isAuth, periodController.addPeriod);
router.post('/update', periodController.updatePeriod);

router.post('/processPayment', periodController.processPayment);
module.exports = router;