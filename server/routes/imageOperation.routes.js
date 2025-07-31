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
router.post("/generateImage",controllers.generateImage)




























router.get("/fetch-image", async (req, res) => {
  console.log("--------------------------runnn")
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    console.log("Fetching DALL-E image:", imageUrl);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch DALL-E image failed:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      const errorText = await response.text();
      console.error("Invalid content type from DALL-E:", {
        contentType,
        body: errorText,
      });
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Image fetched successfully:", { contentType, size: buffer.length });
    res.set("Content-Type", contentType);
    res.send(buffer);
  } catch (error) {
    console.error("Error fetching DALL-E image:", {
      message: error.message,
      status: error.status,
      cause: error.cause,
    });
    res.status(500).json({ error: "Failed to fetch image", details: error.message });
  }
});

module.exports = router;
