// const express = require("express");
// const controllers = require("../controller/imageOperations.controller.js");
// const multer = require('multer');
// const path = require('path');




// const router = express.Router();

// const storage = multer.memoryStorage(); //for S3

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024,  // Max file size: 10MB
//     files: 5                    // Max 2 files
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only JPEG, PNG, and JPG images are allowed"));
//     }
//   }
// });

// const uploadforSingleEditImage = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024,  // Max file size: 10MB
//     files: 5                    // Max 2 files
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only JPEG, PNG, and JPG images are allowed"));
//     }
//   }
// });


// // File filter for image types
// const imageFileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPEG, PNG, and JPG images are allowed"));
//   }
// };

// // Memory storage for streaming to Cloudinary
// const cloudinaryUpload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: imageFileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // Optional: 10MB per file
//     // Do NOT set 'files' limit if you want unlimited number of images
//   }
// });


// const testUpload = multer({ storage: multer.memoryStorage() });

// // router.post("/convertToPng", upload.single('image'), controllers.convertToPng); // Accept both single and multiple files
// // router.post("/upload", upload.array('images', 5), controllers.fileUpload); // Accept both single and multiple files
// // router.delete("/delete", controllers.fileDelete);
// // router.post("/image/list",controllers.getImageGalleryList)
// // router.post("/generateImageByAi",controllers.generateMultipleImagesByAi);
// router.post("/editImageByAi",uploadforSingleEditImage.array('image', 1),controllers.editImageByAi);
// // router.post("/uploadToCloudinary",cloudinaryUpload.array("images"), controllers.fileUploadToCloudinary);
// // router.post("/fileBlobDataUploadToCloudinary",testUpload.any(), controllers.fileBlobDataUploadToCloudinary);
// // router.delete("/deleteFromCloudinary", controllers.deleteImageFromCloudinary);






// router.get("/fetch-image", async (req, res) => {
//   console.log("--------------------------runnn")
//   try {
//     const imageUrl = req.query.url;
//     if (!imageUrl) {
//       return res.status(400).json({ error: "Image URL is required" });
//     }

//     console.log("Fetching DALL-E image:", imageUrl);
//     const response = await fetch(imageUrl);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Fetch DALL-E image failed:", {
//         status: response.status,
//         statusText: response.statusText,
//         body: errorText,
//       });
//       throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
//     }

//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.startsWith("image/")) {
//       const errorText = await response.text();
//       console.error("Invalid content type from DALL-E:", {
//         contentType,
//         body: errorText,
//       });
//       throw new Error(`Invalid content type: ${contentType}`);
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     console.log("Image fetched successfully:", { contentType, size: buffer.length });
//     res.set("Content-Type", contentType);
//     res.send(buffer);
//   } catch (error) {
//     console.error("Error fetching DALL-E image:", {
//       message: error.message,
//       status: error.status,
//       cause: error.cause,
//     });
//     res.status(500).json({ error: "Failed to fetch image", details: error.message });
//   }
// });

// module.exports = router;







const express = require("express");
const controllers = require("../controller/imageOperations.controller.js");
const multer = require('multer');
const path = require('path');




const router = express.Router();

const storage = multer.memoryStorage(); //for S3

const upload = multer({
  storage,
  limits: {
    fileSize: 40 * 1024 * 1024,  // Max file size: 40MB
    files: 5                    // Max 5 files
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

const uploadforSingleEditImage = multer({
  storage,
  limits: {
    fileSize: 40 * 1024 * 1024,  // Max file size: 40MB
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


// File filter for image types
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG images are allowed"));
  }
};

// Memory storage for streaming to Cloudinary
const cloudinaryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // Optional: 20MB per file
    // Do NOT set 'files' limit if you want unlimited number of images
  }
});


const testUpload = multer({ storage: multer.memoryStorage() });

// router.post("/convertToPng", upload.single('image'), controllers.convertToPng); // Accept both single and multiple files
router.post("/upload", upload.array('images', 5), controllers.fileUploadForImgixUrl); // Accept both single and multiple files
router.post("/uploadForS3Url", upload.array('images', 5), controllers.fileUploadForS3Url); // Accept both single and multiple files
router.delete("/delete", controllers.fileDelete);
// router.post("/image/list",controllers.getImageGalleryList)
router.post("/editImageByAi",uploadforSingleEditImage.array('image', 1),controllers.editImageByAi);
router.post("/generateImageByAi",controllers.generateMultipleImagesByAi);
// router.post("/uploadToCloudinary",cloudinaryUpload.array("images"), controllers.fileUploadToCloudinary);
router.post("/fileBlobDataUploadToCloudinary",testUpload.any(), controllers.fileBlobDataUploadToCloudinary);
router.delete("/deleteFromCloudinary", controllers.deleteImageFromCloudinary);


router.post("/saveImageUrlToDbWithThereKey",controllers.saveImageUrlToDbWithThereKey)
router.get("/getImageUrlToDbWithThereKey",controllers.getImageUrlToDbWithThereKey)



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