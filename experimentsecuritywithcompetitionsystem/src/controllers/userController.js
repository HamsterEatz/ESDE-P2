const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');
const logger = require('../middlewares/logger');
const validator = require('validator');

exports.processDesignSubmission = (req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;

    designTitle = validator.escape(designTitle);
    designDescription = validator.escape(designDescription);

    let userId = req.user_id;
    let file = req.body.file;

    fileDataManager.uploadFile(file, async function(error, result) {
        logger.info('check result variable in fileDataManager.upload code block\n', result);
        logger.info('check error variable in fileDataManager.upload code block\n', error);
        //console.log('check result variable in fileDataManager.upload code block\n', result);
        //console.log('check error variable in fileDataManager.upload code block\n', error);
        let uploadResult = result;
        if (error) {
            let message = 'Unable to complete file submission.';
            logger.error('Unable to complete file submission.');
            res.status(500).json({ message: message });
            res.end();
        } else {
            //Update the file table inside the MySQL when the file image
            //has been saved at the cloud storage (Cloudinary)
            let imageURL = uploadResult.imageURL;
            let publicId = uploadResult.publicId;
            //console.log('check uploadResult before calling createFileData in try block', uploadResult);
            logger.info('check uploadResult before calling createFileData in try block ' + uploadResult);
            try {
                let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
                logger.info('Inspert result variable inside fileDataManager.uploadFile code');
                logger.info(result);
                //console.log('Inspert result variable inside fileDataManager.uploadFile code');
                //console.log(result);
                if (result) {
                    let message = 'File submission completed.';
                    logger.info(`User with ${userId} ID successfully submitted an image (${imageURL})`);
                    var jsonResult = {
                        'imageURL': imageURL
                    };
                    res.status(200).json(jsonResult);
                    // res.status(200).json({ message: message, imageURL: imageURL });
                }
            } catch (error) {
                let message = 'File submission failed.';
                logger.error(message);
                res.status(500).json({
                    message: message
                });
            }
        }
    })
}; //End of processDesignSubmission
exports.processGetSubmissionData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.user_id;

    let roleName = req.role_name;
    console.log(roleName);
    if (roleName !== "user") {
        logger.error(`User with ${userId} ID attempted to search for submission data.`);
        return res.status(500).json({
            message: "Not authorized"
        });
    }

    try {
        let results = await fileDataManager.getFileData(userId, pageNumber, search);
        logger.info('Inspect result variable inside processGetSubmissionData code\n', results);
        //console.log('Inspect result variable inside processGetSubmissionData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            logger.info(`User with ${userId} ID successfully got multiple submission data`);
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        console.log(error)
        logger.error(message);
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetSubmissionData
exports.processGetUserData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.user_id;

    try {
        let results = await userManager.getUserData(pageNumber, search);
        logger.info('Inspect result variable inside processGetUserData code\n' + results);
        //console.log('Inspect result variable inside processGetUserData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'userdata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            logger.info(`User with ${userId} ID successfully multiple user data`);
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        logger.error(message);
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetUserData

exports.processGetOneUserData = async(req, res, next) => {
    // let recordId = req.params.recordId;
    let recordId = req.params.recordId === undefined ? req.user_id : req.params.recordId;

    try {
        // let results = await userManager.getOneUserData(recordId);
        let results = await userManager.getOneUserData(recordId);
        logger.info('Inspect result variable inside processGetOneUserData code\n' + results);
        //console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {
            var jsonResult = {
                'userdata': results[0],
            }
            logger.info(`User with ${recordId} ID successfully got profile`);
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        console.log(error)
        logger.error(message);
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetOneUserData


exports.processUpdateOneUser = async(req, res, next) => {
    logger.info('processUpdateOneUser running');
    //console.log('processUpdateOneUser running');
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;
    let userId = req.user_id;

    try {
        results = await userManager.updateUser(recordId, newRoleId);
        //console.log(results);
        logger.info(results);
        logger.info(`User with ${userId} ID successfully updated ${recordId}'s role to ${newRoleId}`);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        logger.error('processUpdateOneUser method : catch block section code is running');
        logger.error(error);
        //console.log('processUpdateOneUser method : catch block section code is running');
        //console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }
}; //End of processUpdateOneUser

exports.processGetOneDesignData = async(req, res, next) => {
    let recordId = req.params.fileId;
    let userId = req.user_id;

    try {
        // let results = await userManager.getOneDesignData(recordId);
        let results = await userManager.getOneDesignData(recordId, userId);
        logger.info('Inspect result variable inside processGetOneFileData code\n' + results);
        //console.log('Inspect result variable inside processGetOneFileData code\n', results);
        if (results) {
            var jsonResult = {
                'filedata': results[0],
            }
            logger.info(`User with ${userId} ID successfully got ${recordId}`);
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process the request.';
        logger.error(message);
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetOneDesignData

exports.processUpdateOneDesign = async(req, res, next) => {
    logger.info('processUpdateOneFile running');
    //console.log('processUpdateOneFile running');
    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.user_id;

    try {
        results = await userManager.updateDesign(fileId, designTitle, designDescription);
        //console.log(results);
        logger.info(`User with ${userId} ID successfully updated ${fileId}`);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }


}; //End of processUpdateOneDesign