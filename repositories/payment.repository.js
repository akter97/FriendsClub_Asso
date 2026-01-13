const db = require("../config/db");

// Form load korar jonno dorkari sob data eksathe ana
exports.getPaymentFormData = (userId, callback) => {
    // Query 1: User-er sathe join kore tar shere_member code gulo ana
    const memberCodesQuery = `SELECT id as member_id, MemberCode FROM users `
     


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
    console.log("Saving following array to DB:", data);
    
    const query = `INSERT INTO payments 
        (member_id, shere_number, payment_date, payment_method, reference, transaction_id, amount, receipt_image, remarks, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // Jehetu 'data' nijei ekti array, tai alada kore params bananor dorkar nai
    // Shudhu 'data' pass kore dilei hobe
    db.query(query, data, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return callback(err);
        }
        callback(null, result);
    });
};


// Payment History fetch kora
exports.getHistoryByUserId = (userId, callback) => {
    const sql = "SELECT * FROM payments WHERE member_id = ? ORDER BY created_at DESC";
    db.query(sql, [userId], callback);
};

// Payment Record delete kora
exports.deletePaymentById = (paymentId, userId, callback) => {
    // Shudhu nijer payment delete korar permission thakbe (Security)
    const sql = "DELETE FROM payments WHERE id = ? AND member_id = ? and status='Pending'";
    db.query(sql, [paymentId, userId], callback);
};