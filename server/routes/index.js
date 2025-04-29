const express = require("express");

const authRoutes = require("./authRoute.js");

const router = express.Router();

router.use("/auth", authRoutes);

module.exports = router;