 const db = require("../config/db");
 exports.getPeriodPage = (req, res) => { 
    const sql = "SELECT * FROM periods ORDER BY id DESC";    
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database Error");
        } 
        res.render('pages/period', {
            title: "Select Period",
            user: req.session.user,
            hideNavbar: false,
            periods: result  
        });
    });
};
 


exports.addPeriod = (req, res) => {
    const { selectedMonth, status } = req.body; 
    const [year, monthNum] = selectedMonth.split('-');
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[parseInt(monthNum) - 1];

    const sql = `INSERT INTO periods (month_name, month_number, year, status,amount) VALUES (?,?, ?, ?, ?)`;
    
    db.query(sql, [monthName, monthNum, year, status,amount], (err, result) => {
        if (err) {
            console.error("Save Error:", err);
            return res.status(500).send("Could not save period");
        } 
        res.redirect('/period'); 
    });
};
 
 
exports.updatePeriod = (req, res) => { 
    const { id, selectedMonth, status, amount } = req.body; 

    const [year, monthNum] = selectedMonth.split('-');
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[parseInt(monthNum) - 1]; 
    const sql = `UPDATE periods SET month_name=?, month_number=?, year=?, status=?, amount=? WHERE id=?`; 
    db.query(sql, [monthName, monthNum, year, status, amount, id], (err, result) => {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).send("Update Failed");
        }
        res.redirect('/period');
    });
};