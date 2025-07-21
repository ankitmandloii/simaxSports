const express = require("express");
const controllers = require("../controller/products.controller.js");
const router = express.Router();




router.post("/list", controllers.productList);
// router.post("/filter", controllers.productFilter);
router.post("/collectionList", controllers.getAllCollectionList);
router.post("/collection/:id", controllers.productsByCollectionId);

module.exports = router;
