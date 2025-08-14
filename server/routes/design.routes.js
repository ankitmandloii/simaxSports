const express = require("express");
const controllers = require("../controller/design.controller.js");
const router = express.Router();
router.post('/send-email-design', controllers.sendEmailDesign);
router.post('/admin-savesettings', controllers.saveSettings);
router.get('/admin-get-settings', controllers.getSettings)


///////////////////////FrontEnd-userDesign APi's//////////////////////////////////////////////
router.post('/save-designfrontEnd', controllers.saveDesignsFromFrontEnd);
router.get('/get-designfrontEnd', controllers.getDesignsFromFrontEnd);
router.delete('/delete-designfrontEnd/:designId', controllers.deleteDesignsFromFrontEnd);


module.exports = router;