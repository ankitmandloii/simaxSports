const express = require("express");

const authRoutes = require("./authRoute.js");
const productsRoutes = require("./productRoute.js");
const designRoutes = require("./designRoute.js");
const customerRoutes = require("./customerRoutes.js");
// const imageOperationRoutes = require("./imageOperationRoutes.js");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/design", designRoutes);
router.use("/customer",customerRoutes)
// router.use("/imageOperation",imageOperationRoutes)



module.exports = router;
