const express = require("express");
const controllers = require("../controller/sync.controller.js");
const router = express.Router();






router.get('/getAllStyleIdsFromDb',controllers.getAllStyleIdsFromDb);
router.post("/saveStyleIdsToDB", controllers.saveStyleIdsToDb);

router.get("/sync-products", controllers.syncProducts);  //middleWare to sync data S&S to shopify
router.get("/productDataGetFromSS", controllers.productDataGetFromSS);  //productDataGetFromSS 

//S&S product Operations
router.post("/saveSSProductsToDb",controllers.saveSSProductsToDb);
router.get("/getProductsFromDb", controllers.getProductsFromDb);

//specs operations
router.post("/fetchAndSaveSpecsDataFromSS", controllers.fetchAndSaveSpecsDataFromSS);
router.get("/fetchSpecsDataFromDb", controllers.fetchSpecsDataFromDb);

//inventory operations
router.post("/fetchAndSaveSInventoryFromSS", controllers.fetchAndSaveSInventoryFromSS);
router.get("/fetchInventoryDataFromDb", controllers.fetchInventoryDataFromDb);

module.exports = router;
