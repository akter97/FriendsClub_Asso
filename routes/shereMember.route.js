const express = require('express');
const router = express.Router();
const shereMemberController = require('../controllers/shereMember.controller'); 
router.get('/', shereMemberController.getShareMemberPage); 
router.post('/add', shereMemberController.addShareMember);
router.post('/update', shereMemberController.updateShareMember);

/* 
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    const db = require("../config/db");
    db.query("DELETE FROM share_members WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send("Delete Failed");
        res.redirect('/shere_member');
    });
}); */
module.exports = router;