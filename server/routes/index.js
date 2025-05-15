const express = require("express");

const authRoutes = require("./authRoute.js");
const productsRoutes = require("./productRoute.js");
const imageOperationRoutes = require("./imageOperationRoutes.js");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/imageOperation",imageOperationRoutes)



module.exports = router;