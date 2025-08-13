// const services = require("../services/imageOperations.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const ImageGallery = require("../model/imageGallery.model.js");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
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




// images.controller.js
// If you're on Node <18: const fetch = require("node-fetch");
// exports.generateMultipleImagesByAi = async (req, res) => {
//   try {
//     const prompt = req.body.prompt ?? "Make subtle improvements";
//     const size   = req.body.size   ?? "1024x1024";
//     const n      = Number(req.body.n ?? 1);
//     const model  = req.body.model  ?? "gpt-image-1";

//     // 1) Call OpenAI with JSON (NOT multipart)
//     const genResp = await fetch("https://api.openai.com/v1/images/generations", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ model, prompt, size, n }),
//     });

//     const genData = await genResp.json();
//     if (!genResp.ok) return res.status(genResp.status).json(genData);

//     // const items = Array.isArray(genData?.data) ? genData.data : [];
//     // if (items.length === 0) {
//     //   return res.status(502).json({ message: "OpenAI returned no image data", data: genData });
//     // }

//     // // 2) Fetch each URL and convert to base64 and data URLs (PNG is typical)
//     // const mime = "image/png"; // or detect via response headers if you like
//     // const base64 = await Promise.all(
//     //   items.map(async (it) => {
//     //     const url = it?.url;
//     //     if (!url) return null;
//     //     const r = await fetch(url);
//     //     if (!r.ok) return null;
//     //     const buf = Buffer.from(await r.arrayBuffer());
//     //     return {
//     //       base64: buf.toString("base64"),
//     //       dataUrl: `data:${mime};base64,${buf.toString("base64")}`,
//     //       bytes: buf.length,
//     //     };
//     //   })
//     // );

//     // const filtered = base64.filter(Boolean);
//     // if (filtered.length === 0) {
//       return res.status(502).json({ message: "Could not download any image URLs", data: genData });
//     // }

//     return res.status(200).json({
//       message: "Images generated",
//       prompt, size, n, model,
//       images: filtered, // [{ base64, dataUrl, bytes }]
//     });
//   } catch (err) {
//     console.error("Image generation failed:", err);
//     return res.status(500).json({ message: "Image generation failed", error: String(err) });
//   }
// };


const fetch = require("node-fetch"); // If Node <18

// exports.generateMultipleImagesByAi = async (req, res) => {
//   try {
//     const prompt = req.body.prompt ?? "Make subtle improvements";
//     const size   = req.body.size   ?? "1024x1024";
//     const n      = Number(req.body.n ?? 1);
//     const model  = req.body.model  ?? "gpt-image-1";

//     // Call OpenAI
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
//         n,
//       }),
//     });

//     const data = await resp.json();
//     if (!resp.ok) {
//       return res.status(resp.status).json(data);
//     }

//     const images = Array.isArray(data?.data) ? data.data : [];
//     if (!images.length) {
//       return res.status(502).json({ message: "OpenAI returned no image data", data });
//     }

//     // Create a folder to store images
//     const saveDir = path.join(process.cwd(), "generated_images");
//     await fs.promises.mkdir(saveDir, { recursive: true });

//     // Save each image as a PNG file
//     const savedFiles = [];
//     for (let i = 0; i < images.length; i++) {
//       const b64 = images[i]?.b64_json;
//       if (!b64) continue;
//       const buf = Buffer.from(b64, "base64");
//       const filename = `image_${Date.now()}_${i + 1}.png`;
//       const filePath = path.join(saveDir, filename);
//       await fs.promises.writeFile(filePath, buf);
//       savedFiles.push(filePath);
//     }

//     return res.status(200).json({
//       message: "Images generated and saved successfully",
//       savedFiles,
//       folder: saveDir,
//     });

//   } catch (err) {
//     console.error("Generate image error:", err);
//     return res.status(500).json({
//       message: "Image generation failed",
//       error: String(err),
//     });
//   }
// };


// controllers/images.js
// If Node < 18, uncomment the next line
// const fetch = require("node-fetch");

exports.generateMultipleImagesByAi = async (req, res) => {
    try {
        const prompt = req.body.prompt ?? "Make subtle improvements";
        const size = req.body.size ?? "1024x1024";
        const n = Number(req.body.n ?? 1);
        const model = req.body.model ?? "gpt-image-1";

        // Optional controls (can pass in body or querystring):
        // view: "json" | "image" | "html"
        // imageIndex: which image to stream when view=image
        const view = (req.query.view || req.body.view || "json").toLowerCase();
        const imageIndex = Number(req.query.imageIndex ?? req.body.imageIndex ?? 0);

        // 1) Call OpenAI (JSON only; multipart/form-data is rejected by the API)
        const genResp = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ model, prompt, size, n }),
        });

        const genData = await genResp.json();
        if (!genResp.ok) return res.status(genResp.status).json(genData);

        const items = Array.isArray(genData?.data) ? genData.data : [];
        if (!items.length) {
            return res.status(502).json({ message: "OpenAI returned no image data", data: genData });
        }

        // Prefer URLs (current API default). Fall back to b64 if present.
        const urls = items.map(d => d?.url).filter(Boolean);
        const b64s = items.map(d => d?.b64_json).filter(Boolean);

        // ---- VIEW: SINGLE IMAGE (best for Postman Preview) ----
        if (view === "image") {
            const i = Math.min(Math.max(0, imageIndex), items.length - 1);

            // If we have a URL, stream it
            if (urls[i]) {
                const r = await fetch(urls[i]);
                if (!r.ok) return res.status(502).json({ message: "Could not fetch generated image URL" });

                // Pass through content-type from OpenAI CDN (usually image/png or image/webp)
                const ct = r.headers.get("content-type") || "image/png";
                res.setHeader("Content-Type", ct);
                // No 'Content-Disposition' so Postman shows inline
                const buf = Buffer.from(await r.arrayBuffer());
                return res.send(buf);
            }

            // Else if we only have base64 from API, decode and send
            if (b64s[i]) {
                const buf = Buffer.from(b64s[i], "base64");
                res.setHeader("Content-Type", "image/png");
                return res.send(buf);
            }

            return res.status(502).json({ message: "No usable image data at that index." });
        }

        // ---- VIEW: HTML PAGE WITH ALL IMAGES (nice gallery in Postman) ----
        if (view === "html") {
            // Build src list from urls or b64s
            const srcs = urls.length
                ? urls
                : b64s.map(b64 => `data:image/png;base64,${b64}`);

            const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Generated Images</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    h1 { font-size: 18px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .card { border: 1px solid #eee; border-radius: 12px; padding: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
    img { max-width: 100%; height: auto; display: block; border-radius: 8px; }
    .meta { font-size: 12px; color: #666; margin-top: 6px; }
  </style>
</head>
<body>
  <h1>${model} — ${n} image(s) — ${size}</h1>
  <div class="grid">
    ${srcs.map((src, idx) => `
      <div class="card">
        <img src="${src}" alt="Generated ${idx + 1}" />
        <div class="meta">#${idx + 1}</div>
      </div>`).join("")}
  </div>
</body>
</html>`;

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            return res.status(200).send(html);
        }

        // ---- VIEW: JSON (default) ----
        // Include both urls and dataUrls (if only b64 present)
        const dataUrls = (!urls.length && b64s.length)
            ? b64s.map(b64 => `data:image/png;base64,${b64}`)
            : [];

        return res.status(200).json({
            message: "Images generated",
            prompt, size, n, model,
            urls,
            dataUrls,       // only present if URLs were not returned
            raw: genData,   // keep the raw OpenAI payload in case you need metadata
        });

    } catch (err) {
        console.error("Generate image error:", err);
        return res.status(500).json({ message: "Image generation failed", error: String(err) });
    }
};


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