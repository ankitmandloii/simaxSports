const express = require("express");
const controllers = require("../controller/products.controller.js");

// const customerValidation = require("../schema/customerValidation.js");

// const validation = require("../validations/authValidation.js");
const router = express.Router();



// router.post('/signup',customerValidation.customerRegister, controllers.signup);
// router.post('/signup', controllers.signUp);
router.post("/list", controllers.productList);
router.post("/filter",  controllers.productFilter);
router.post("/collectionList",controllers.getAllCollectionList)
router.post("/collection/:id", controllers.productsByCollectionId)

module.exports = router;
