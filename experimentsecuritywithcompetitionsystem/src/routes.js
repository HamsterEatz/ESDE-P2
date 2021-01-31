// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const checkRoleFn = require('./middlewares/checkRoleFn');
const validator = require('./middlewares/validator');

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', validator.validateLogin, authController.processLogin);
    router.post('/api/user/register', validator.validateRegister, authController.processRegister);
    router.post('/api/user/process-submission', checkUserFn.getClientUserId, checkRoleFn.getUserRole, userController.processDesignSubmission);
    router.put('/api/user/', checkUserFn.getClientUserId, checkRoleFn.getUserRole, userController.processUpdateOneUser);
    router.put('/api/user/design/',checkUserFn.getClientUserId, checkRoleFn.getUserRole,  userController.processUpdateOneDesign);

    router.get('/api/user/process-search-design/:pagenumber/:search?', checkUserFn.getClientUserId, checkRoleFn.getUserRole, userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?', checkUserFn.getClientUserId, userController.processGetUserData);
    router.get('/api/user', checkUserFn.getClientUserId, checkRoleFn.getUserRole, userController.processGetOneUserData);
    router.get('/api/user/:recordId', checkUserFn.getClientUserId, checkRoleFn.getUserRole, userController.processGetOneUserData);
    router.get('/api/user/design/:fileId', checkUserFn.getClientUserId, checkRoleFn.getUserRole, userController.processGetOneDesignData);

};