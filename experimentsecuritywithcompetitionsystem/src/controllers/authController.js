const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const logger = require('../middlewares/logger');


// exports.processLogin = (req, res, next) => {
exports.processLogin = async (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;

    try {
        let results = await auth.authenticate(email);
        if (results && results.length == 1) {
            // if ((password == null) || (results[0] == null)) {
            if ((password == null) || (results[0].user_password == null)) {
                logger.error("Login failed");
                return res.status(500).json({ message: 'login failed' });
            }
            if (bcrypt.compareSync(password, results[0].user_password) == true) {

                let data = {
                    role_name: results[0].role_name,
                    token: jwt.sign({ id: results[0].user_id }, config.JWTKey, {
                        expiresIn: 86400 //Expires in 24 hrs
                    })
                }; //End of data variable setup

                logger.info(`User with ID ${results[0].user_id} has logged in.`);

                return res.status(200).json(data);
            } else {
                // return res.status(500).json({ message: 'Login has failed.' });
                logger.error("Login failed");
                return res.status(500).json({ message: "Login failed" });
            } //End of passowrd comparison with the retrieved decoded password.
        }

        /* function(error, results) {
        if (error) {
            let message = 'Credentials are not valid.';
            //return res.status(500).json({ message: message });
            //If the following statement replaces the above statement
            //to return a JSON response to the client, the SQLMap or
            //any attacker (who relies on the error) will be very happy
            //because they relies a lot on SQL error for designing how to do 
            //attack and anticipate how much "rewards" after the effort.
            //Rewards such as sabotage (seriously damage the data in database), 
            //data theft (grab and sell). 
            return res.status(500).json({ message: error });

        } else {
            if (results.length == 1) {                    
                if ((password == null) || (results[0] == null)) {
                    return res.status(500).json({ message: 'login failed' });
                }
                if (bcrypt.compareSync(password, results[0].user_password) == true) {

                    let data = {
                        user_id: results[0].user_id,
                        role_name: results[0].role_name,
                        token: jwt.sign({ id: results[0].user_id }, config.JWTKey, {
                            expiresIn: 86400 //Expires in 24 hrs
                        })
                    }; //End of data variable setup

                    return res.status(200).json(data);
                } else {
                    // return res.status(500).json({ message: 'Login has failed.' });
                    return res.status(500).json({ message: error });
                } //End of passowrd comparison with the retrieved decoded password.
            } //End of checking if there are returned SQL results

        }

    }) */

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: error });
    } //end of try
};

// If user submitted data, run the code in below
exports.processRegister = (req, res, next) => {
    console.log('processRegister running');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;


    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            //console.log('Error on hashing password');
            logger.error("Error on hashing password");
            return res.status(500).json({ message: 'Unable to complete registration' });
        } else {
            try {
                results = await user.createUser(fullName, email, hash);
                //console.log(results);
                logger.info(results);
                return res.status(200).json({ message: 'Completed registration' });
            } catch (error) {
                //console.log('processRegister method : catch block section code is running');
                logger.error('processRegister method : catch block section code is running');
                logger.error(error);
                logger.error('Unable to complete registration');
                //console.log(error, '=======================================================================');
                return res.status(500).json({ message: 'Unable to complete registration' });
            }
        }
    });


}; //End of processRegister