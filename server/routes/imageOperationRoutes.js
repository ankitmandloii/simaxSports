const express = require("express");
const controllers = require("../controller/imageOperations.controller.js");
// const multer = require('multer');
const router = express.Router();



// const upload = multer({ dest: 'uploads/' });
// router.post("/convertToPng",  upload.single('image'),controllers.convertToPng);



router.post("/upload", uploads.array("files", 100), controllers.fileUpload);
router.delete("/delete", controllers.fileDelete);
router.post("/image/list",controllers.getImageGalleryList)

// module.exports = router;
