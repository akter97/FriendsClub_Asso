const db = require("../config/db"); 
const promiseDb = db.promise();
const dashboardRepo = {

    getMemberCounts: async () => {
        const [result] = await promiseDb.query('CALL sp_GetMemberCounts()');
        return result[0][0];  
    },
 

    
// Overall Stats
    getOverallStats: async (userId, roleId) => { 
        const [result] = await promiseDb.query('CALL sp_GetOverallPaymentStats(?, ?)', [userId, roleId]); 
        return result[0][0]; 
    },

    // Monthly Stats
    getMonthlyStats: async (userId, roleId) => {
        const [result] = await promiseDb.query('CALL sp_GetMonthlyStats(?, ?)', [userId, roleId]);
        return result[0][0];
    }, 


    getWeeklyStats: async () => {
        const [result] = await promiseDb.query('CALL sp_GetWeeklyStats()');
        return result[0][0];
    },

    getTodaysPayments: async () => {
        const [result] = await promiseDb.query('CALL sp_GetTodaysPayments()');
        return result[0];  
    },

    getRecentPayments: async () => {
        const [result] = await promiseDb.query('CALL sp_GetRecentPayments()');
        return result[0];  
    }
};

module.exports = dashboardRepo;