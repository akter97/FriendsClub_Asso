 
const User = require("../models/user.model");
const repo = require("../repositories/user.repository");
const fs = require('fs');
const path = require('path'); 


exports.getUsers = (req, res) => { 
  if (!req.session.isLoggedIn) {
    return res.redirect("/login"); 
  }

  repo.getAllUsers((err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error");
    } 
    res.render("pages/users", { 
        users: result, 
        title: "User List", 
        user: req.session.user,  
        hideNavbar: false 
    });
  });
};

 
 exports.addUser = (req, res) => {
  const user = {
    roleId: req.body.roleId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    MemberCode: req.body.MemberCode,
    FathersName: req.body.FathersName,
    MothersName: req.body.MothersName,
    MobileNo: req.body.MobileNo,
    PassportNo: req.body.PassportNo,
    Organization: req.body.Organization,
    PresentAddress: req.body.PresentAddress,
    Picture: req.file ? req.file.filename : null
  };

  console.log('Adding user:', user);

  repo.addUser(user, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('User save failed');
    }
    res.redirect('/users');
  });
};

/* =========================
   UPDATE USER (EDIT)
========================= */
 exports.updateUser = (req, res) => {
    const {
        id, roleId, name, email, password, MemberCode,
        FathersName, MothersName, MobileNo,
        PassportNo, Organization, PresentAddress, OldPicture
    } = req.body; 
    const picture = req.file ? req.file.filename : OldPicture;
 

    // Delete old picture if new one uploaded
    if (req.file && OldPicture && OldPicture !== 'default.png') {
        const oldPath = path.join(__dirname, '../public/Image/ProfilePicture/', OldPicture);
        fs.unlink(oldPath, (err) => {
            if (err) console.error('Failed to delete old picture:', err);
            else console.log('Old picture deleted:', OldPicture);
        });
    }


    const userData = {
        id, roleId, name, email, MemberCode,
        FathersName, MothersName, MobileNo,
        PassportNo, Organization, PresentAddress, picture
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
        userData.password = password;
    } 

    // Use repo method
    repo.updateUser(userData, (err, result) => { 
        if (err) {
            console.error(err); 
            return res.status(500).send('User update failed');
        }
 res.json({ success: true, message: 'User updated successfully' }); 
    });
};




exports.changePasswordPage = (req, res) => { 
  res.render("pages/change_password", {
    title: "Change Password",
    user: req.session.user,
    hideNavbar: false
  });
};
// Password update handle korar jonno 
 exports.changePassword = (req, res) => {    
    const { old_password, new_password, confirm_password } = req.body;
 
    if (!req.session.user || !req.session.user.id) {
        return res.render('pages/change_password', { 
            title: 'Change Password', error: 'Please login first!', success: null 
        });
    }

    const userId = req.session.user.id;  
    repo.getUserForValidation(userId, async (err, results) => {      
        if (err || results.length === 0) {
            return res.render('pages/change_password', { 
                title: 'Change Password', error: 'User not found in database!', success: null 
            });
        }
 
        const dbUser = results[0];   
        
        if (old_password!=dbUser.password) { 
            return res.render('pages/change_password', { 
                title: 'Change Password', error: 'Old password is incorrect!', success: null 
            });
        } 
         
        repo.updateUserPassword(userId, new_password, (updateErr) => {
            if (updateErr) {
              console.log(22);
                return res.render('pages/change_password', { 
                    title: 'Change Password', 
                    error: 'Update failed!', 
                    success: null,
                    user: req.session.user,
                    hideNavbar: false 
                });
            } 
            res.render('pages/change_password', { 
                title: 'Change Password', 
                error: null, 
                success: 'Password updated successfully! ✅',
                user: req.session.user,
                hideNavbar: false 
            });
    });
    });
};