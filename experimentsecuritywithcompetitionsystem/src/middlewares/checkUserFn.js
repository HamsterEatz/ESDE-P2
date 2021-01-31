var jwt = require('jsonwebtoken');
const logger = require('./logger');

module.exports.getClientUserId = (req, res, next) => {

    /*
    req.body.userId = req.headers['user'];
    console.log('Inspect user id which is planted inside the request header : ', req.body.userId);
    if (req.body.userId != null) {
        next()
        return;
    } else {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }
    */

    logger.info('http header - user ', req.headers['user']);
    var token = req.headers['user'];
    logger.info('Inspect user id which is planted inside the request header : ', token);
    res.type('json');
    if (!token || !token.includes("Bearer ")) {
        logger.error("User not authenticated");
        res.status(403);
        res.send(`{"Message":"Not Authorized"}`);

    } else {
        token = token.substring(7);
        jwt.verify(token, config.JWTKey, function (err, decoded) {
            if (err) {//key invalid
                logger.error("User not authorized");
                res.status(403);
                res.send(`{"Message":"Not Authorized"}`);
            } else {
                req.user_id = decoded.id;
                next();
            }

        });
    }

} //End of getClientUserId