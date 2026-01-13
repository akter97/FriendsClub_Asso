const db = require("../config/db");

// Form load korar jonno dorkari sob data eksathe ana
exports.getPaymentFormData = (userId, callback) => {
    // Query 1: User-er sathe join kore tar shere_member code gulo ana
    const memberCodesQuery = `
        SELECT MemberCode FROM users `


    const referencesQuery = "SELECT id, name FROM users WHERE id != ?";

    db.query(memberCodesQuery, [userId], (err, codes) => {
        if (err) return callback(err);
        
        db.query(referencesQuery, [userId], (err, refs) => {
            if (err) return callback(err);
            
            callback(null, { codes, refs });
        });
    });
};
 
exports.savePayment = (data, callback) => {
    const query = `INSERT INTO payments 
        (member_id, shere_number, payment_date, payment_method, reference, transaction_id, amount, receipt_image, remarks, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
        data.member_id, data.shere_number, data.payment_date, 
        data.payment_method, data.reference, data.transaction_id, 
        data.amount, data.receipt_image, data.remarks, data.payment_status
    ];

    db.query(query, params, callback);
};