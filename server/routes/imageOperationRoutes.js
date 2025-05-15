const express = require("express");
const controllers = require("../controller/imageOperations.controller.js");
const multer = require('multer');
const router = express.Router();



const upload = multer({ dest: 'uploads/' });
router.post("/convertToPng",  upload.single('image'),controllers.convertToPng);


module.exports = router;
