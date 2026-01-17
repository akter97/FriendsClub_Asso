const dashboardRepo = require("../repositories/dashboard.repository");

exports.getDashboard = async (req, res) => {
    console.log("Session User:", req.session.user);
    const userId = req.session.user.id;
    const roleId = req.session.user.roleId;
    console.log(userId);
    console.log(roleId);
    try {  
        const counts = await dashboardRepo.getMemberCounts(); 
        const overall = await dashboardRepo.getOverallStats(userId,roleId); 
        const monthly = await dashboardRepo.getMonthlyStats(userId,roleId); 
        const weekly = await dashboardRepo.getWeeklyStats(); 
        const todaysPayments = await dashboardRepo.getTodaysPayments(); 
        const recentPayments = await dashboardRepo.getRecentPayments(); 
        const dashboardData = {
            dashboardStats: { 
                members: counts?.members || 0,
                admins: counts?.admins || 0,
                active: counts?.active || 0, 
                
                cash: overall?.cash || 0,
                due: overall?.due || 0,
                maxCash: overall?.maxCash || 0,

                monthly: {
                    cash: monthly?.cash || 0,
                    due: monthly?.due || 0,
                    maxCash: monthly?.maxCash || 0
                }, 
                weekly: {
                    cash: weekly?.cash || 0,
                    due: weekly?.due || 0,
                    maxCash: weekly?.maxCash || 0
                }
            }, 
            todaysPayments: todaysPayments || [],
            recentPayments: recentPayments || []
        };

       // res.render('pages/dashboard', dashboardData);
       res.render('pages/dashboard', { 
    title: 'Dashboard',
    hideNavbar: false,
    user: req.session.user,
    dashboardData 
});

    } catch (err) {
        console.error("Dashboard Controller Error:", err.message);
        res.status(500).send(" server problem।");
    }
};