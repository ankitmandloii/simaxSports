const express = require("express");
const controllers = require("../controller/imageOperations.controller.js");
const multer = require('multer');




const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,  // Max file size: 10MB
    files: 5                    // Max 2 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and JPG images are allowed"));
    }
  }
});




router.post("/upload", upload.array('images', 5), controllers.fileUpload); // Accept both single and multiple files
router.delete("/delete", controllers.fileDelete);
// router.post("/image/list",controllers.getImageGalleryList)

module.exports = router;
