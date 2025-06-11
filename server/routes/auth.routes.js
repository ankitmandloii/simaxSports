const express = require("express");
const controllers = require("../controller/auth.controller.js");
const customerValidation = require("../schema/customerValidation.js");
const router = express.Router();




router.post('/signup',customerValidation.customerRegister, controllers.signUp);
router.post('/login',customerValidation.login ,controllers.login);
router.post('/admin-change-password',customerValidation.verifyToken, controllers.adminChangePassword);
router.post('/track-anonymous-user', controllers.trackAnonymousUser)
router.get('/get-active-user-count',customerValidation.verifyToken, controllers.getActiveUserCount)


module.exports = router;
