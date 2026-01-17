const db = require("../config/db");

// Form load korar jonno dorkari sob data eksathe ana
 exports.getPaymentFormData = (userId, roleId, callback) => {
    let memberCodesQuery = "";
    let queryParams = [];
 
    if (roleId == 1) { 
        memberCodesQuery = "SELECT id as member_id, MemberCode FROM users";
        queryParams = [];
    } else { 
        memberCodesQuery = "SELECT id as member_id, MemberCode FROM users WHERE id = ?";
        queryParams = [userId];
    }
 
    db.query(memberCodesQuery, queryParams, (err, codes) => {
        if (err) return callback(err); 
        const referencesQuery = "SELECT id, name FROM users WHERE id != ?";
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
 
exports.getPaymentFormDataRequest = (userId, roleId, callback) => { 
    const query = `
    SELECT 
    p.*,
    u.name AS member_name,
    r.name AS reference_name
FROM payments AS p
INNER JOIN users AS u ON p.member_id = u.id
LEFT JOIN users AS r ON p.member_id = r.id
ORDER BY p.id DESC
    `; 
    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
         console.log(results);
        callback(null, {
            pendingPayments: results, 
            codes: results.map(row => row.shere_number), 
            refs: results.map(row => row.reference)
        });
    });
};
exports.updatePaymentStatus = (paymentId, status, updatedBy) => {    
    return new Promise((resolve, reject) => {
        const query = `CALL sp_UpdatePaymentStatus(?, ?, ?)`;
        db.query(query, [paymentId, status, updatedBy], (err, results) => {
            if(err) return reject(err);
             resolve(results[0][0]);// first result set
        });
    });
};