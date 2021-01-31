const pool = require('../config/database');
const logger = require('./logger');

module.exports.getUserRole = (req, res, next) => {
    let userId = req.user_id;
    userDataQuery = `SELECT role_name FROM user INNER JOIN role ON user.role_id = role.role_id WHERE user_id=?`;

    pool.getConnection((err, connection) => {
        if (err) {
            logger.error('Database connection error ', err);
            res.status(403);
            res.send(`{"Message":"Something went wrong"}`);
        } else {
            connection.query(userDataQuery, [userId], (err, results) => {
                if (err) {
                    logger.error('Database query error ', err);
                    res.status(403);
                    res.send(`{"Message":"Something went wrong"}`);
                } else {
                    req.role_name = results[0].role_name;
                    next();
                }
                connection.release();
            });
        }
    });

}