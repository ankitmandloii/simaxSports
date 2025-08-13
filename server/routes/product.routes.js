const express = require("express");
const controllers = require("../controller/products.controller.js");
const router = express.Router();




router.post("/list", controllers.productList);
// router.post("/filter", controllers.productFilter);
router.post("/collectionList", controllers.getAllCollectionList);
router.post("/collection/:id", controllers.productsByCollectionId);
router.post("/addVariantsOnStaticProduct", controllers.addProductVariants);

router.get('/search', controllers.productsSearch);
module.exports = router;
