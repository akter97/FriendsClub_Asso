const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const multer = require("multer");
const path = require("path");
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Image/voucher/"); 
  },
  filename: (req, file, cb) => { 
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes
router.get("/payment", paymentController.getPaymentPage);
//router.post("/payment", upload.single("receipt_image"), paymentController.postPayment);

router.post("/payment", upload.single("receipt_image"), paymentController.postPayment);
router.get("/payment-history-data", paymentController.getPaymentHistory); 
router.delete("/payment/delete/:id", paymentController.postDeletePayment);


router.get("/payment-approved", paymentController.getPaymentRequestPage);
router.post('/update-status', paymentController.updateStatus);
module.exports = router;