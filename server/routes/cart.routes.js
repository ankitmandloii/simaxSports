const express = require("express");
const controllers = require("../controller/cart.controller.js");
const router = express.Router();




router.post("/createCart", controllers.createCart);
router.post("/addtoCart", controllers.addToCart);
router.post("/updateCart", controllers.updateCart);// Update lines (quantity/attributes)
router.post("/removeCart", controllers.removeCart); // Remove lines
router.get("/getCart", controllers.getCart);  // Get cart (by cookie or query)
router.post("/setOrClearNotesCart", controllers.setOrClearNotesCart); // Set / clear note





module.exports = router;
