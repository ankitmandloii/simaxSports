// const services = require("../services/imageOperations.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const ImageGallery = require("../model/imageGallery.model.js");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
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


// exports.generateImage = async (req, res) => {



const crypto = require("crypto");

const IMGIX_DOMAIN = process.env.IMGIX_DOMAIN; // e.g. simaxdesigns.imgix.net
const SECURE_TOKEN = process.env.SECURE_TOKEN; // your imgix signing token

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Prompt is required" });
  }

  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const pathAndQuery = `/ai?text2image=true&prompt=${encodedPrompt}`;

    // Generate HMAC SHA1 signature
    const signature = crypto
      .createHmac("sha1", SECURE_TOKEN)
      .update(pathAndQuery)
      .digest("hex");

    const signedUrl = `https://${IMGIX_DOMAIN}${pathAndQuery}&s=${signature}`;

    // Optional: You could check the image status via Imgix if it supports polling (currently it doesn’t)
    // For now, return the signed URL for the client to use
    return res.json({ success: true, imageUrl: signedUrl });
  } catch (error) {
    console.error("Error generating Imgix image:", error);
    return res.status(500).json({ success: false, error: "Something went wrong with image generation" });
  }
};
