const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const multer = require("multer");
const path = require("path");

// ১. Multer Setup (Receipt Image upload korar jonno)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/receipts/"); // Folder-ti 'public/uploads/receipts' e thakte hobe
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });
 
const isAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

 
router.get("/payment", isAuth, paymentController.getPaymentPage);
 
router.post("/payment", isAuth, upload.single("receipt_image"), paymentController.postPayment);

module.exports = router;