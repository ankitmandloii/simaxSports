const express = require("express");
const controllers = require("../controller/auth.controller.js");
const customerValidation = require("../schema/customerValidation.js");
const router = express.Router();




router.post('/signup',customerValidation.customerRegister, controllers.signUp);
router.post('/login',customerValidation.login ,controllers.login); //currntly use in admin

router.post('/loginShopify' ,controllers.logintest);
router.post('/userDataAfterShopifyLogin' ,controllers.meTest);
router.post('/signUpShopify' ,controllers.signUpTest);
router.post('/logoutShopify' ,controllers.logoutTest);




router.post("/calculatePrice",controllers.calculatePrice);
router.post("/getDiscountDetails",controllers.getDiscountDetails); //get discount based 
// example : 
// 0.05 = 5% discount

// 0.10 = 10% discount

// 0.15 = 15% discount

// 0.005 = 0.5% discount
router.put("/setDiscountDetails",customerValidation.verifyToken,controllers.setDiscountDetails); //update Descount from admin side


router.post('/admin-change-password',customerValidation.verifyToken, controllers.adminChangePassword);
// router.post('/track-anonymous-user', controllers.trackAnonymousUser)
// router.get('/get-active-user-count',customerValidation.verifyToken, controllers.getActiveUserCount)

router.post('/tActiveUserL', controllers.trackActiveUsersWithLocation)
router.get('/getActiveUsersWithLocation', controllers.getActiveUsersWithLocation)






// router.post('/track-location', controllers.trackLocation);
// router.get('/getTrackedLocation', controllers.getTrackedLocation);

module.exports = router;
