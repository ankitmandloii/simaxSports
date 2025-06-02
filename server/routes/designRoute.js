const express = require("express");
const controllers = require("../controller/design.controller.js");

const router = express.Router();




router.post('/send-email-design', controllers.sendEmailDesign);
router.post('/admin-savesettings', controllers.saveSettings);
router.get('/admin-get-settings', controllers.getSettings)

module.exports = router;