const paymentRepo = require('../repositories/payment.repository');

 exports.getPaymentPage = (req, res) => {
    // Session check
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    paymentRepo.getPaymentFormData(userId, (err, data) => {
        if (err) {
            console.error("Repository Error:", err);
            return res.status(500).send("Database connection error or query failed.");
        } 
        res.render('pages/payment', {
            title: "Make Payment",
            memberCodes: data.codes || [],
            references: data.refs || [],
            methods: ['Cash', 'Bank', 'bKash', 'Nagad'],
            user: req.session.user,
            hideNavbar: false,
            error: null,
            success: null
        });
    });
}; 

 exports.postPayment = (req, res) => {
    const { 
        member_id,share_number, payment_date, payment_method, 
        reference, transaction_id, amount, remarks, payment_status 
    } = req.body;
console.log(req.body);
    //const member_id = req.session.user.id;
    const receipt_image = req.file ? req.file.filename : null;

    // Cash hole transaction_id null hobe, nahole input value nibe
    const finalTransactionId = (payment_method === 'Cash') ? null : transaction_id;

    const paymentData = [
        member_id,
        share_number,
        payment_date,
        payment_method,
        reference === 'None' ? null : reference,
        finalTransactionId, // Ekhane NULL jacche Cash-er jonno
        amount,
        receipt_image,
        remarks,
        payment_status || 'Due'
    ];

    paymentRepo.savePayment(paymentData, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).send("Database Error: " + err.sqlMessage);
        }
        res.redirect("/dashboard?status=success");
    });
};
// Modal-er jonno data pathano
exports.getPaymentHistory = (req, res) => {
    const userId = req.session.user.id;
    paymentRepo.getHistoryByUserId(userId, (err, results) => {
        if (err) return res.status(500).json({ error: "Data fetch failed" });
        res.json(results);
    });
};

// Payment Delete kora
exports.postDeletePayment = (req, res) => {
    const paymentId = req.params.id;
    const userId = req.session.user.id;

    paymentRepo.deletePaymentById(paymentId, userId, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Delete failed" });
        res.json({ success: true, message: "Payment deleted successfully" });
    });
};