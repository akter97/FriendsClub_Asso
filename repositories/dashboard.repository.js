const db = require("../config/db"); 
const promiseDb = db.promise();
const dashboardRepo = {

    getMemberCounts: async () => {
        const [result] = await promiseDb.query('CALL sp_GetMemberCounts()');
        return result[0][0];  
    },

    getOverallStats: async () => {
        const [result] = await promiseDb.query('CALL sp_GetOverallPaymentStats()');
        return result[0][0];
    },

    getMonthlyStats: async () => {
        const [result] = await promiseDb.query('CALL sp_GetMonthlyStats()');
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