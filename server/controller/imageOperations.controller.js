// const services = require("../services/imageOperations.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const ImageGallery = require("../model/imageGallery.model.js");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const SaveImageSchema = require("../model/saveImageSchema.js");
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


exports.fileUploadForImgixUrl = async (req, res) => {
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

exports.fileUploadForS3Url = async (req, res) => {
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
            const fileUrlFromS3Direct = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
            // const fileUrlFromImgixDirect = `https://${process.env.IMGIX_DOMAIN}/${fileKey}`;
            uploadedUrls.push({
                name: file.originalname,
                url: fileUrlFromS3Direct
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


//generate images in base64 API
// exports.generateMultipleImagesByAi = async (req, res) => {
//   console.log("DALL-E-3 MULTI (looped) START");
//   try {
//     const promptBase = req.body.prompt ?? "A beautiful landscape painting";
//     const size       = req.body.size   ?? "1024x1024";
//     const model      = req.body.model  ?? "dall-e-3"; // dall-e-3 only allows n=1
//     const count      = Number(req.body.count ?? 2);   // how many you want
//     const jitter     = String(req.body.jitter ?? "true").toLowerCase() === "true";
//     const maxConcurrent = 3; // prevent hitting rate limits

//     const postOnce = async (body, attempt = 0) => {
//       const r = await fetch("https://api.openai.com/v1/images/generations", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });
//       if (!r.ok && (r.status === 429 || r.status >= 500) && attempt < 3) {
//         const wait = Math.min(4000, 500 * Math.pow(2, attempt));
//         await new Promise(s => setTimeout(s, wait));
//         return postOnce(body, attempt + 1);
//       }
//       return r;
//     };

//     const results = new Array(count);
//     let next = 0;

//     // worker consumes tasks until all "count" are done
//     const worker = async () => {
//       while (true) {
//         const i = next++;
//         if (i >= count) break; // exit loop when finished

//         // optional prompt jitter to force variation
//         const noise  = jitter ? ` — v${i+1}-${Math.random().toString(36).slice(2, 6)}` : "";
//         const prompt = jitter ? `${promptBase}${noise}` : promptBase;

//         const body = { model, prompt, size, n: 1, response_format: "b64_json" };

//         try {
//           const resp = await postOnce(body);
//           const data = await resp.json();
//           if (resp.ok && data?.data?.[0]?.b64_json) {
//             results[i] = `data:image/png;base64,${data.data[0].b64_json}`;
//           } else {
//             results[i] = null;
//             console.error("Image gen failed:", data?.error || data);
//           }
//         } catch (err) {
//           results[i] = null;
//           console.error("Worker error:", err);
//         }
//       }
//     };

//     // spin up N workers, each fetching images until done
//     await Promise.all(
//       Array.from({ length: Math.min(maxConcurrent, count) }, worker)
//     );

//     const okImages = results.filter(Boolean);
//     if (!okImages.length) {
//       return res.status(502).json({ message: "No images generated" });
//     }

//     return res.status(200).json({
//       message: `Generated ${okImages.length} image(s)`,
//       prompt: promptBase,
//       size,
//       model,
//       count,
//       images: okImages, // array of base64-encoded data URLs
//     });
//   } catch (err) {
//     console.error("Generate image error:", err);
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


const MAX_RETRIES = 3;

async function postWithBackoff(body, attempt = 0) {
  const resp = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Retry 429/5xx with exponential backoff
  if (!resp.ok && (resp.status === 429 || resp.status >= 500) && attempt < MAX_RETRIES) {
    const wait = Math.min(4000, 500 * 2 ** attempt); // 500, 1000, 2000, 4000
    await new Promise(r => setTimeout(r, wait));
    return postWithBackoff(body, attempt + 1);
  }
  return resp;
}

exports.generateMultipleImagesByAi = async (req, res) => {
  try {
    const promptBase = req.body.prompt ?? "A beautiful landscape painting";
    const size = req.body.size ?? "1024x1024";
    const model = req.body.model ?? "dall-e-3";
    const count = Math.max(1, Number(req.body.count ?? 5));

    // small prompt noise to reduce near-duplicates
    const jitter = String(req.body.jitter ?? "true").toLowerCase() === "true";

    // run a few calls in parallel to be fast but avoid 429s
    const maxConcurrent = Math.max(1, Math.min(Number(req.body.maxConcurrent ?? 3), 5));

    const results = new Array(count);
    let next = 0;

    const worker = async () => {
      while (next < count) {
        const i = next++;
        const noise = jitter ? ` — v${i + 1}-${Math.random().toString(36).slice(2, 6)}` : "";
        const prompt = jitter ? `${promptBase}${noise}` : promptBase;

        // Ask for URL output (default). Do NOT set response_format.
        const body = { model, prompt, size, n: 1 };

        try {
          const resp = await postWithBackoff(body);
          const data = await resp.json();

          if (!resp.ok) {
            results[i] = { ok: false, status: resp.status, error: data };
            continue;
          }

          const item = Array.isArray(data?.data) ? data.data[0] : undefined;
          const url  = item?.url || null;

          results[i] = url ? { ok: true, url } : { ok: false, status: 502, error: { message: "No URL" } };
        } catch (err) {
          results[i] = { ok: false, status: 500, error: { message: String(err) } };
        }
      }
    };

    const workers = Array.from({ length: Math.min(maxConcurrent, count) }, worker);
    await Promise.all(workers);

    const ok = results.filter(r => r?.ok && r.url).map(r => r.url);
    const errors = results
      .map((r, i) => ({ i, r }))
      .filter(({ r }) => !r?.ok)
      .map(({ i, r }) => ({ index: i, status: r?.status ?? 500, error: r?.error ?? { message: "Unknown error" } }));

    if (!ok.length) {
      return res.status(502).json({ message: "No images generated", errors });
    }

    return res.status(200).json({
      message: `Generated ${ok.length} image(s)`,
      prompt: promptBase,
      size,
      model,
      count,
      urls: ok,     // <-- plain URLs (not base64)
      errors,       // any per-call failures
    });
  } catch (err) {
    console.error("Generate image error:", err);
    return res.status(500).json({ message: "Image generation failed", error: String(err) });
  }
};







// Helper function to save Blob data as PNG
// async function uploadImageToCloudinary(buffer, originalFileName, folderName) {
//   return new Promise((resolve, reject) => {
//     // Create a unique public ID for Cloudinary
//     const publicId = `${folderName}/${path.parse(originalFileName).name}_${Date.now()}`;

//     // Use Cloudinary's uploader.upload_stream to upload a buffer
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'image',
//         folder: folderName,
//         public_id: publicId, // Set a public ID
//         overwrite: true // Overwrite if public ID exists (good for re-uploads)
//       },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           return reject(error);
//         }
//         resolve(result); // result will contain the Cloudinary URL and other info
//       }
//     );

//     // Pipe the buffer to the upload stream
//     uploadStream.end(buffer);
//   });
// }


// exports.fileBlobDataUploadToCloudinary = async (req, res) => {
//   try {
//     // Multer puts all files into req.files when using upload.any()
//     const uploadedFiles = req.files || []; // This will be an array of file objects from Multer

//     console.log("Received files count:", uploadedFiles.length);

//     if (!uploadedFiles.length) {
//       return res.status(400).json({ message: "No image files provided." });
//     }

//     const uploadedResults = [];

//     // Process each uploaded file
//     for (let i = 0; i < uploadedFiles.length; i++) {
//       const file = uploadedFiles[i]; // Each 'file' object is from Multer

//       // `file.buffer` contains the binary data of the uploaded image
//       // `file.originalname` is the filename provided by the frontend (e.g., 'image_0.png')
//       console.log(`Processing file: ${file.originalname}, Size: ${file.size} bytes`);

//       // Upload the buffer directly to Cloudinary
//       const result = await uploadImageToCloudinary(file.buffer, file.originalname, process.env.FOLDER_NAME || 'your_default_folder');

//       // Push the Cloudinary result (including the URL) to the uploaded array
//       uploadedResults.push(result.secure_url);
//     }

//     return res.status(200).json({
//       success: true,
//       uploadedCount: uploadedResults.length,
//       files: uploadedResults // This array will contain Cloudinary response objects
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return res.status(500).json({
//       message: "File upload failed",
//       error: error.message
//     });
//   }
// };


function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function buildObjectKey(originalFileName, folderName) {
  const ext = path.extname(originalFileName) || "";
  const base = path.basename(originalFileName, ext);
  const safeBase = sanitizeName(base);
  const safeExt = sanitizeName(ext) || "";
  const folder = folderName || process.env.FOLDER_NAME || "your_default_folder";
  return `${folder}/${safeBase}_${Date.now()}${safeExt}`.replace(/\/{2,}/g, "/");
}

function buildPublicS3Url({ bucket, region, key }) {
  // virtual-hosted–style URL
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function uploadBufferToS3(buffer, originalFileName, folderName, mimetype) {
  const Bucket = process.env.S3_BUCKET;
  if (!Bucket) throw new Error("S3_BUCKET env var is required");
  const Key = buildObjectKey(originalFileName, folderName);

  const cmd = new PutObjectCommand({
    Bucket,
    Key,
    Body: buffer,
    ContentType: mimetype || "application/octet-stream",
    // ACL: "public-read", // Only if your bucket is public. Prefer keeping private + CloudFront.
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3Client.send(cmd);

  return {
    key: Key,
    bucket: Bucket,
    url: buildPublicS3Url({ bucket: Bucket, region: process.env.AWS_REGION, key: Key }),
  };
}

// ---- handler: same name/signature/response as your Cloudinary version ----
exports.fileBlobDataUploadToCloudinary = async (req, res) => {
  try {
    // Multer with memoryStorage puts files in req.files
    const uploadedFiles = req.files || [];

    console.log("Received files count:", uploadedFiles.length);

    if (!uploadedFiles.length) {
      return res.status(400).json({ message: "No image files provided." });
    }

    const uploadedResults = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      console.log(`Processing file: ${file.originalname}, Size: ${file.size} bytes, Type: ${file.mimetype}`);

      const result = await uploadBufferToS3(
        file.buffer,
        file.originalname,
        process.env.FOLDER_NAME || "your_default_folder",
        file.mimetype
      );

      // Push the S3 public URL to results (matches prior shape: array of URLs)
      uploadedResults.push(result.url);
    }

    return res.status(200).json({
      success: true,
      uploadedCount: uploadedResults.length,
      files: uploadedResults, // array of S3 URLs
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "File upload failed",
      error: error.message,
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


//save to db image with key 
exports.saveImageUrlToDbWithThereKey = async (req, res) => {
  try {
    const { key, urls } = req.body;
    if (!key || !urls) return res.status(400).json({ error: 'key and urls required' });

    const arr = Array.isArray(urls) ? urls.flat() : (urls ? [urls] : []);
    const clean = arr.filter(u => typeof u === 'string' && u.trim()).map(u => u.trim());

    const doc = await SaveImageSchema.findOneAndUpdate(
      { key },
      {
        $setOnInsert: { key },
        ...(clean.length ? { $addToSet: { urls: { $each: clean } } } : {})
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );
    res.json({ message: 'Added', data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getImageUrlToDbWithThereKey = async (req, res) => {
  try {
    const { key } = req.body;

    let skip  = Number.parseInt(req.query.skip  ?? '0', 10);
    let limit = Number.parseInt(req.query.limit ?? '100', 10);

    if (!Number.isFinite(skip)  || skip  < 0)   skip  = 0;
    if (!Number.isFinite(limit) || limit <= 0)  limit = 100;
    if (limit > 200) limit = 200; // cap to prevent huge payloads

    const doc = await SaveImageSchema.findOne(
      { key },
      { _id: 0, key: 1, urls: { $slice: [skip, limit] } } // $slice [skip, limit]
    ).lean(); // return POJOs for speed

    if (!doc) return res.status(404).json({ error: 'Key not found' });

    const returned = Array.isArray(doc.urls) ? doc.urls.length : 0;
    res.json({
      key: doc.key,
      urls: doc.urls ?? [],
      nextSkip: skip + returned
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



