const express = require("express");

const authRoutes = require("./auth.routes.js");
const productsRoutes = require("./product.routes.js");
const designRoutes = require("./design.routes.js");
const customerRoutes = require("./customer.routes.js");
const imageOperationRoutes = require("./imageOperation.routes.js");
const ssSyncRoutes = require("./sync.routes.js");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/design", designRoutes);
router.use("/customer",customerRoutes)
router.use("/imageOperation",imageOperationRoutes);
router.use("/sync",ssSyncRoutes);  //middleWare to sync data S&S to shopify



module.exports = router;
