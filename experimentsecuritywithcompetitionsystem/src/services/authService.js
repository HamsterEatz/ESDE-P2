config = require('../config/config');
const pool = require('../config/database');
const AwsConfig = require('../config/cognitoConfig');

module.exports.signUp = (email, password, agent = 'none') => {
    return new Promise((resolve) => {
        console.log("HERE");
        AwsConfig.initAWS();
        console.log("HERE");
        AwsConfig.setCognitoAttributeList(email, agent);
        console.log("HERE");
        AwsConfig.getUserPool().signUp(email, password, AwsConfig.getCognitoAttributeList(), null, function (err, result) {
            console.log(err, result);
            if (err) {
                return resolve({ statusCode: 422, response: err });
            }
            const response = {
                username: result.user.username,
                userConfirmed: result.userConfirmed,
                userAgent: result.user.client.userAgent,
            }
            return resolve({ statusCode: 201, response: response });
        });
    });
}

module.exports.verify = (email, code) => {
    return new Promise((resolve) => {
        AwsConfig.getCognitoUser(email).confirmRegistration(code, true, (err, result) => {
            if (err) {
                return resolve({ statusCode: 422, response: err });
            }
            return resolve({ statusCode: 400, response: result });
        });
    });
};

module.exports.signIn = (email, password) => {
    return new Promise((resolve) => {
        AwsConfig.getCognitoUser(email).authenticateUser(AwsConfig.getAuthDetails(email, password), {
            onSuccess: (result) => {
                const token = {
                    accessToken: result.getAccessToken().getJwtToken(),
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                }
                return resolve({ statusCode: 200, response: AwsConfig.decodeJWTToken(token) });
            },

            onFailure: (err) => {
                return resolve({ statusCode: 400, response: err.message || JSON.stringify(err) });
            },
        });
    });
};


module.exports.authenticate = (email, callback) => {
    /*
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;

        } else {
            try {
                connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
               FROM user INNER JOIN role ON user.role_id=role.role_id AND email='${email}'`, {}, (err, rows) => {
                    if (err) {
                        if (err) return callback(err, null);

                    } else {
                        if (rows.length == 1) {
                            console.log(rows);
                            return callback(null, rows);

                        } else {

                            return callback('Login has failed', null);
                        }
                    }
                    connection.release();

                });
            } catch (error) {
                return callback(error, null);;
            }
        }
    }); //End of getConnection */

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`, [email], (err, rows) => {
                    if (err) {
                        if (err) reject(err);
                    } else {
                        if (rows.length == 1) {
                            console.log(rows);
                            resolve(rows);
                        } else {
                            reject('Login has failed');
                        }
                    }
                    connection.release();
                });
            }
        }); //End of getConnection
    });
} //End of authenticate