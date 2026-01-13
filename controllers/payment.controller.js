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
console.log(data.codes);
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
    const { shere_number, payment_date, payment_method, reference, transaction_id, amount, remarks, payment_status } = req.body;
    const member_id = req.session.user.id;
    const receipt_image = req.file ? req.file.filename : null;

    const paymentData = {
        member_id, shere_number, payment_date, payment_method, 
        reference, transaction_id, amount, receipt_image, 
        remarks, payment_status
    };

    paymentRepo.savePayment(paymentData, (err, result) => {
        if (err) {
            console.error(err);
            // Error hole abar page render kora message shoho
            return res.render('pages/payment', {
                title: "Make Payment",
                error: "Transaction ID already exists or Database Error!",
                success: null,
                memberCodes: [], // Proyojone ekhane abar data fetch logic deya jay
                references: [],
                methods: ['Cash', 'Bank', 'bKash', 'Nagad'],
                user: req.session.user,
                hideNavbar: false
            });
        }
        
        res.render('pages/payment', {
            title: "Make Payment",
            success: "Payment Request Sent Successfully! Wait for Approval.",
            error: null,
            memberCodes: [], 
            references: [],
            methods: ['Cash', 'Bank', 'bKash', 'Nagad'],
            user: req.session.user,
            hideNavbar: false
        });
    });
};