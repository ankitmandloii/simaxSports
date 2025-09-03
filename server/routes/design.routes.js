const express = require("express");
const controllers = require("../controller/design.controller.js");
const router = express.Router();
router.post('/send-email-design', controllers.sendEmailDesign);
router.post('/admin-savesettings', controllers.saveSettings);
router.get('/admin-get-settings', controllers.getSettings)


///////////////////////FrontEnd-userDesign APi's//////////////////////////////////////////////
router.post('/save-designfrontEnd', controllers.saveDesignsFromFrontEnd);
router.patch('/updateDesignFromFrontEnd', controllers.updateDesignFromFrontEnd);
router.get('/get-designfrontEnd', controllers.getDesignsFromFrontEndByEmail);
router.get('/getDesignsFromFrontEndById', controllers.getDesignsFromFrontEndById);
router.delete('/delete-designfrontEnd/:designId', controllers.deleteDesignsFromFrontEnd);
router.get("/get-AllOrderedDesignfrontEnd", controllers.getAllOrderedDesigns);
router.get("/getAllDesigns", controllers.getAllDesigns);




// will be in product routes
router.post("/productById", controllers.productById);
module.exports = router;