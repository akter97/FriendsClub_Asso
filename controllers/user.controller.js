 
const User = require("../models/user.model");
const repo = require("../repositories/user.repository");

// All Users Dekhar Jonno logic
exports.getUsers = (req, res) => {
  // ১. Prothome check korbe user login ki na
  if (!req.session.isLoggedIn) {
    return res.redirect("/login"); // Login na thakle login page-e pathabe
  }

  repo.getAllUsers((err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error");
    }
    // Dashboard ba onno page theke user list render kora
    res.render("pages/users", { 
        users: result, 
        title: "User List", 
        user: req.session.user, // Login kora user-er info
        hideNavbar: false 
    });
  });
};

// Notun User Add Korar Logic
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
 
    const userData = {
        id, roleId, name, email, MemberCode,
        FathersName, MothersName, MobileNo,
        PassportNo, Organization, PresentAddress, picture
    };
 
    if (password && password.trim() !== '') {
        userData.password = password;
    } 
    repo.updateUser(userData, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Database Error" });
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

    // Session check (id undefined error bondho korar jonno)
    if (!req.session.user || !req.session.user.id) {
        return res.render('pages/change_password', { 
            title: 'Change Password', error: 'Please login first!', success: null 
        });
    }

    const userId = req.session.user.id; 
    // STEP 1: Repository theke user-er current data ana
    repo.getUserForValidation(userId, async (err, results) => {      
        if (err || results.length === 0) {
            return res.render('pages/change_password', { 
                title: 'Change Password', error: 'User not found in database!', success: null 
            });
        }
 
        const dbUser = results[0]; // Database theke pawa user

 
        // STEP 2: Old Password Match check kora (Bcrypt comparison)
        
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
            console.log(202);
            // Success Message pathano
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