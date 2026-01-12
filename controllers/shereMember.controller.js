const db = require("../config/db");

exports.getShareMemberPage = (req, res) => { 
    const sql = `
        SELECT sm.*, u.name as member_name, u.MemberCode, p.month_name, p.year 
        FROM share_members sm
        JOIN users u ON sm.user_id = u.id
        JOIN periods p ON sm.start_period_id = p.id
        ORDER BY sm.id DESC;
        SELECT id, name, MemberCode FROM users;
        SELECT id, month_name, year FROM periods;
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).send("Database Error");
        
        res.render('pages/shere_member', {
            title: "Share Member Management",
            shareMembers: results[0],
            users: results[1],
            periods: results[2],
            user: req.session.user,
            hideNavbar: false
        });
    });
};

 
exports.addShareMember = (req, res) => {
    const { user_id, share_code, start_period_id, status } = req.body; 
    const checkUserSql = "SELECT id FROM users WHERE MemberCode = ?";
    db.query(checkUserSql, [share_code], (err, userResults) => {
        if (userResults.length > 0) {
            return res.status(400).send("Error: This code is already used in Users table!");
        }

        const sql = "INSERT INTO share_members (user_id, share_code, start_period_id, status) VALUES (?, ?, ?, ?)";
        db.query(sql, [user_id, share_code, start_period_id, status], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).send("Error: Share Code already exists!");
                return res.status(500).send("Save Failed");
            }
            res.redirect('/shere_member');
        });
    });
};

 
exports.updateShareMember = (req, res) => {
    const { id, user_id, share_code, start_period_id, status } = req.body;

    const sql = "UPDATE share_members SET user_id=?, share_code=?, start_period_id=?, status=? WHERE id=?";
    db.query(sql, [user_id, share_code, start_period_id, status, id], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).send("Error: Share Code already exists!");
            return res.status(500).send("Update Failed");
        }
        res.redirect('/shere_member');
    });
};