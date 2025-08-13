// const services = require("../services/imageOperations.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const ImageGallery = require("../model/imageGallery.model.js");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
// const archiver = require("archiver");
// const axios = require('axios');




// exports.convertToPng = async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: 'No image uploaded' });
//     }

//     const inputPath = req.file.path;

//     try {
//         // const metadata = await sharp(inputPath).metadata();
//         // console.log(metadata.format)
//         const outputPath = await services.convertToPng(inputPath);

//         res.download(outputPath, 'converted.png', (err) => {
//             // Clean up files after sending
//             fs.unlinkSync(inputPath);
//             fs.unlinkSync(outputPath);
//             if (err) console.error('Download error:', err);
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Image conversion failed' });
//     }
// };




/*app.get("/imgix-url", (req, res) => {
  const { key, bgRemove, resize, sharp } = req.query;

  let url = `https://your.imgix.net/${key}`;

  const params = [];
  if (bgRemove === "true") params.push("bg-remove=true");
  if (resize) params.push(`w=${resize}`);
  if (sharp) params.push(`sharp=${sharp}`);

  if (params.length) url += "?" + params.join("&");

  res.json({ imgixUrl: url });
});
*/
//APi for get Full url with operation 





const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_SECRET_KEY
    }
});

const sanitizeFilenameFunction = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '_')            // Replace spaces with underscores
        .replace(/[^\w\-\.]+/g, '')      // Remove non-alphanumeric except dot, dash, underscore
        .replace(/_+/g, '_')             // Replace multiple underscores with single
        .trim();
};


exports.fileUpload = async (req, res) => {
    try {
        const files = req.files?.length ? req.files : req.file ? [req.file] : [];

        if (files.length === 0) {
            return res.status(400).json({ message: "No file(s) uploaded" });
        }

      

        const uploadedUrls = [];

        for (const file of files) {
            const sanitizedName = sanitizeFilenameFunction(file.originalname);
            const fileKey = `uploads/${Date.now()}_${sanitizedName}`;
            const uploadParams = {
                Bucket: process.env.S3_BUCKET,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const uploadCommand = new PutObjectCommand(uploadParams);
            await s3Client.send(uploadCommand);
            // const fileUrlFromS3Direct = https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key};
            const fileUrlFromImgixDirect = `https://${process.env.IMGIX_DOMAIN}/${fileKey}`;
            uploadedUrls.push({
                name: file.originalname,
                url: fileUrlFromImgixDirect
            });
        }

        res.status(200).json({
            success: true,
            uploaded: uploadedUrls.length,
            files: uploadedUrls
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "File upload failed", error: err.message });
    }
};




//delete File From AWS -S3 bucket API
exports.fileDelete = async (req, res) => {
    const { key } = req.body;


    if (!key) {
        return res.status(400).json({ message: "Missing file key in request body" });
    }

    const deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Key: key, // Example: "uploads/162123_file.jpg"
    };

    try {
        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);

        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
            deletedKey: key
        });
    } catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Failed to delete file", error: err.message });
    }
};

// delete folder 
exports.deleteFolder = async (domain) => {
    try {
        const shop = domain.split(".")[0];
        // List all objects in the folder
        const listParams = {
            Bucket: process.env.S3_BUCKET,
            Prefix: shop
        };
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        if (listedObjects.Contents.length === 0) {
            console.log('Folder is already empty or does not exist');
            return;
        }
        // Create a list of objects to delete
        const deleteParams = {
            Bucket: process.env.S3_BUCKET,
            Delete: { Objects: [] }
        };
        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
        });
        // Delete the listed objects
        await s3.deleteObjects(deleteParams).promise();
        // If there are more objects to delete, recursively call the function
        if (listedObjects.IsTruncated) {
            await deleteFolder(process.env.S3_BUCKET, shop);
        } else {
            console.log('Folder deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting folder:', error);
    }
}

// get uploaded image by user
exports.getImageGalleryList = async (request, response) => {
    try {
        const partnerId = request.body.partnerId
        const result = await ImageGallery.find({ partnerId }).limit(request.body.limit).skip(request.body.offset)
        return sendResponse(response, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        return sendResponse(response, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}

exports.readFile = async (request, response, path) => {
    const session = response.locals.shopify.session || response.locals.shopify
    const shop = session.shop.split(".")[0];
    console.log(path, "path key")
    const params = {
        Bucket: `${process.env.S3_BUCKET}`,
        Key: 'ec96df98-091f-46dc-9624-1795e1572a7f.json',
    };

    const data = await s3.getObject(params).promise();

    // Parse the file content as JSON
    const jsonData = JSON.parse(data.Body.toString('utf-8'));

    console.log('JSON data from S3:', jsonData);
    return jsonData;
}




// controllers/generateImageByAi.js
// exports.generateImageByAi = async (req, res) => {
//   try {
//     const body = req.body || {};
//     const prompt = body.prompt || "Make subtle improvements";
//     const size = body.size || "1024x1024";
//     const n = parseInt(body.n || "1", 10);
//     const model = body.model || "gpt-image-1";

//     const resp = await fetch("https://api.openai.com/v1/images/generations", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ model, prompt, size, n }),
//     });

//     const data = await resp.json();
//     if (!resp.ok) {
//       return res.status(resp.status).json(data);
//     }

//     // Prefer b64_json; fall back to url
//     let imgBuffer;
//     const first = data?.data?.[0];

//     if (first?.b64_json) {
//       imgBuffer = Buffer.from(first.b64_json, "base64");
//     } else if (first?.url) {
//       const imgResp = await fetch(first.url);
//       if (!imgResp.ok) {
//         return res.status(502).json({ message: "Failed to fetch image URL", data: first });
//       }
//       const arr = await imgResp.arrayBuffer();
//       imgBuffer = Buffer.from(arr);
//     } else {
//       return res.status(502).json({ message: "OpenAI returned no image data", data });
//     }

//     const filename = `generated_${Date.now()}.png`;
//     res.setHeader("Content-Type", "image/png");
//     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//     return res.send(imgBuffer);
//   } catch (err) {
//     console.error("Generate image error:", err);
//     return res.status(500).json({ message: "Image generation failed", error: String(err) });
//   }
// };

// controllers/generateMultipleImagesByAi.js



// exports.generateMultipleImagesByAi = async (req, res) => {
//   try {
//     const body = req.body || {};
//     const prompt = body.prompt || "A beautiful nature scene";
//     const size = body.size || "1024x1024";
//     const n = parseInt(body.n || "3", 10);  // Set the number of images to generate
//     const model = body.model || "gpt-image-1";

//     const resp = await fetch("https://api.openai.com/v1/images/generations", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model,
//         prompt,
//         size,
//         n,  // Number of images to generate
//       }),
//     });

//     const data = await resp.json();
//     if (!resp.ok) {
//       return res.status(resp.status).json(data);
//     }

//     const images = data?.data || [];
//     if (images.length === 0) {
//       return res.status(502).json({ message: "OpenAI returned no image data", data });
//     }

//     // Initialize an array for image buffers
//     const imageBuffers = [];

//     // Check and store image buffers for all images
//     images.forEach((imgData, index) => {
//       if (imgData?.b64_json) {
//         try {
//           const imgBuffer = Buffer.from(imgData.b64_json, "base64");
//           imageBuffers.push({
//             buffer: imgBuffer,
//             filename: `generated_${Date.now()}_${index + 1}.png`,
//           });
//         } catch (err) {
//           console.error(`Error processing image ${index + 1}:`, err);
//         }
//       } else {
//         console.warn(`Image ${index + 1} is missing 'b64_json'. Skipping.`);
//       }
//     });

//     if (imageBuffers.length === 0) {
//       return res.status(502).json({ message: "No valid image data found" });
//     }

//     // Create a zip file and send it as the response
//     const zip = archiver("zip", {
//       zlib: { level: 9 }, // Set compression level to maximum
//     });

//     res.setHeader("Content-Type", "application/zip");
//     res.setHeader("Content-Disposition", "attachment; filename=generated_images.zip");

//     zip.pipe(res);

//     imageBuffers.forEach((image) => {
//       zip.append(image.buffer, { name: image.filename });
//     });

//     zip.finalize();  // Finish the zip stream

//     zip.on("finish", () => {
//       console.log("ZIP file has been sent.");
//     });

//   } catch (err) {
//     console.error("Generate images error:", err);
//     return res.status(500).json({ message: "Image generation failed", error: String(err) });
//   }
// };




// controller snippet
exports.editImageByAi = async (req, res) => {
  try {
    const baseImage = req.files?.[0] || req.file;
    if (!baseImage) return res.status(400).json({ message: "Missing file: image" });

    const prompt = req.body.prompt || "Make subtle improvements";
    const size = req.body.size || "1024x1024";
    const n = req.body.n || "1";
    const model = req.body.model || "gpt-image-1";

    // IMPORTANT: use Web FormData + Blob
    const form = new FormData();
    form.append("model", model);
    form.append("prompt", prompt);
    form.append("size", size);
    form.append("n", n);

    // Convert Buffer -> Blob
    const imgBlob = new Blob([baseImage.buffer], {
      type: baseImage.mimetype || "image/png",
    });
    form.append("image", imgBlob, baseImage.originalname || "image.png");

    // Optional mask
    const mask = req.files?.find(f => f.fieldname === "mask");
    if (mask) {
      const maskBlob = new Blob([mask.buffer], {
        type: mask.mimetype || "image/png",
      });
      form.append("mask", maskBlob, mask.originalname || "mask.png");
    }

    const resp = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form, // DO NOT spread getHeaders() when using Web FormData
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json(data);

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return res.status(502).json({ message: "OpenAI returned no image data", data });

    const imgBuffer = Buffer.from(b64, "base64");
    res.setHeader("Content-Type", "image/png");
    return res.send(imgBuffer);
  } catch (err) {
    console.error("Edit image error:", err);
    res.status(500).json({ message: "Image edit failed", error: String(err) });
  }
};





// const uploadImageToCloudinary = (fileBuffer, fileName, folder) => {
//     console.log("uploadImageToCloudinary")
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: "image"
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve({
//           name: fileName,
//           secureUrl: result.secure_url,
//           publicId: result.public_id
//         });
//       }
//     );

//     stream.end(fileBuffer);
//   });
// };


// exports.fileUploadToCloudinary = async (req, res) => {
//   try {
//     const files = req.files || [];
//     console.log("filesfiles",files.length)
//     if (!files.length) {
//       return res.status(400).json({ message: "No file(s) uploaded" });
//     }

//     const uploaded = [];

//     for (const file of files) {
//         console.log("filesComessssssss");
//       const result = await uploadImageToCloudinary(file.buffer, file.originalname , process.env.FOLDER_NAME);
//       uploaded.push(result);
//     }

//     return res.status(200).json({
//       success: true,
//       uploaded: uploaded.length,
//       files: uploaded
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return res.status(500).json({
//       message: "File upload failed",
//       error: error.message
//     });
//   }
// };


// Helper function to save Blob data as PNG
async function uploadImageToCloudinary(buffer, originalFileName, folderName) {
    return new Promise((resolve, reject) => {
        // Create a unique public ID for Cloudinary
        const publicId = `${folderName}/${path.parse(originalFileName).name}_${Date.now()}`;
 
        // Use Cloudinary's uploader.upload_stream to upload a buffer
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: folderName,
                public_id: publicId, // Set a public ID
                overwrite: true // Overwrite if public ID exists (good for re-uploads)
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }
                resolve(result); // result will contain the Cloudinary URL and other info
            }
        );
 
        // Pipe the buffer to the upload stream
        uploadStream.end(buffer);
    });
}
 
 
exports.fileBlobDataUploadToCloudinary = async (req, res) => {
    try {
        // Multer puts all files into req.files when using upload.any()
        const uploadedFiles = req.files || []; // This will be an array of file objects from Multer
 
        console.log("Received files count:", uploadedFiles.length);
 
        if (!uploadedFiles.length) {
            return res.status(400).json({ message: "No image files provided." });
        }
 
        const uploadedResults = [];
 
        // Process each uploaded file
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i]; // Each 'file' object is from Multer
 
            // `file.buffer` contains the binary data of the uploaded image
            // `file.originalname` is the filename provided by the frontend (e.g., 'image_0.png')
            console.log(`Processing file: ${file.originalname}, Size: ${file.size} bytes`);
 
            // Upload the buffer directly to Cloudinary
            const result = await uploadImageToCloudinary(file.buffer, file.originalname, process.env.FOLDER_NAME || 'your_default_folder');
 
            // Push the Cloudinary result (including the URL) to the uploaded array
            uploadedResults.push(result.secure_url);
        }
 
        return res.status(200).json({
            success: true,
            uploadedCount: uploadedResults.length,
            files: uploadedResults // This array will contain Cloudinary response objects
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            message: "File upload failed",
            error: error.message
        });
    }
};

//delete

exports.deleteImageFromCloudinary = async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ message: "publicId is required to delete the image" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(404).json({ message: "Image not found or already deleted" });
    }

    res.status(200).json({ success: true, message: "Image deleted", result });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
};