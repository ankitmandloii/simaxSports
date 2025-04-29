const express = require("express");
const controllers = require("../controller/auth.controller.js");

const customerValidation = require("../schema/customerValidation.js");

// const validation = require("../validations/authValidation.js");
const router = express.Router();



// router.post('/signup',customerValidation.customerRegister, controllers.signup);
router.post('/signup', controllers.signUp);
router.post('/login', controllers.login);
// router.post('/logout', controllers.logout);

module.exports = router;
