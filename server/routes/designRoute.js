const express = require("express");
const controllers = require("../controller/design.controller.js");

const router = express.Router();




router.post('/send-email-design', controllers.sendEmailDesign);

module.exports = router;