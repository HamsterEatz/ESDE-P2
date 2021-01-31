const validator = require('validator');
const logger = require('./logger');

var validationFn = {

    validateRegister: function (req, res, next) {
        var email = req.body.email;
        var password = req.body.password;

        var rePassword = new RegExp(`^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$`);

        if (rePassword.test(password) && validator.isEmail(email)) {
            next();
        } else {
            logger.error("User failed registering");
            res.status(500);
            res.send(`{"Message":"Error!!"}`);
        }
    },

    validateLogin: function (req, res, next) {
        var email = req.body.email;

        if (validator.isEmail(email)) {
            next();
        } else {
            logger.error("User tried logging in with invalid email");
            res.status(500);
            res.send(`{"Message":"Error!!"}`);
        }

    },

    sanitizeResult: function (result) {
        for (i = 0; i < result.length; i++) {
            var row = result[i];
            console.log(row);
            for (var key in row) {
                val = row[key];
                if (typeof val === "string") {
                    row[key] = validator.escape(val);
                }
            }
        }
    }

}

module.exports = validationFn;