const express = require("express");
const router = express.Router();
const brandController = require("../controller/brand.controller")



router.post("/addBrand", brandController.addBrands);
router.get("/getAllBrand", brandController.getAllBrands);






// router.post('/track-location', controllers.trackLocation);
// router.get('/getTrackedLocation', controllers.getTrackedLocation);

module.exports = router;
