const express = require("express");
const controllers = require("../controller/sync.controller.js");
const router = express.Router();






router.get('/getAllStyleIdsFromDb',controllers.getAllStyleIdsFromDb);
router.post("/saveStyleIdsToDB", controllers.fetchAndStoreStyleIdsWhichClientWants);

router.get("/sync-products", controllers.syncSandsToShopify);  //middleWare to sync data S&S to shopify
router.get("/delete-productsFromShopify", controllers.deleteShopifyProduct);  //middleWare to sync data S&S to shopify
// router.get("/sync-products", controllers.syncSandsToShopifytest);  //middleWare to sync data S&S to shopify
router.get("/productDataGetFromSS", controllers.productDataGetFromSS);  //productDataGetFromSS 
router.get("/productLenghtGetFromSS", controllers.productLenghtGetFromSS); //how much product in this styleid
//S&S product Operations
router.post("/saveSSProductsToDb",controllers.saveSSProductsToDb);
router.get("/getProductsFromDb", controllers.getProductsFromDb);
router.get("/getProductByStyleIdFromDb", controllers.getProductByStyleIdFromDb);








//specs operations
router.post("/fetchAndSaveSpecsDataFromSS", controllers.fetchAndSaveSpecsDataFromSS);
router.get("/fetchSpecsDataFromDb", controllers.fetchSpecsDataFromDb);

//inventory operations
router.post("/fetchAndSaveSInventoryFromSS", controllers.fetchAndSaveSInventoryFromSS);
router.get("/fetchInventoryDataFromDb", controllers.fetchInventoryDataFromDb);

//check order or product in inventry QTY for order
router.get("/checkStock", controllers.checkStock);

//shopify Cart Add with Customization
// router.post("/customCartAdd",controllers.customCartAdd);

module.exports = router;
