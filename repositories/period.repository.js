const db = require('../config/db');

exports.deletePeriod = (id, callback) => {

    const sql = "DELETE FROM periods WHERE id=? AND process=0";

    db.query(sql, [id], callback);

};