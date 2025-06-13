const express = require("express");
const controllers = require("../controller/auth.controller.js");
const customerValidation = require("../schema/customerValidation.js");
const router = express.Router();




router.post('/webhooks/order-creation', controllers.orderCreationWEbHooks);
router.post('/signup',customerValidation.customerRegister, controllers.signUp);
router.post('/login',customerValidation.login ,controllers.login);
router.post('/admin-change-password',customerValidation.verifyToken, controllers.adminChangePassword);
// router.post('/track-anonymous-user', controllers.trackAnonymousUser)
// router.get('/get-active-user-count',customerValidation.verifyToken, controllers.getActiveUserCount)

router.post('/tActiveUserL', controllers.trackActiveUsersWithLocation)
router.get('/getActiveUsersWithLocation', controllers.getActiveUsersWithLocation)

// router.post('/track-location', controllers.trackLocation);
// router.get('/getTrackedLocation', controllers.getTrackedLocation);

module.exports = router;
