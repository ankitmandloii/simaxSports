// const services = require("../services/imageOperations.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const ImageGallery = require("../model/imageGallery.model.js");
// const fs = require('fs');
// // const sharp = require('sharp');


const aws = require("aws-sdk");
const {v4: uuidv4} = require("uuid");
const path = require("path");




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





const spacesEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_SECRET_KEY
    }
});

exports.fileUpload = async (request, response) => {
    try {
        const session = response.locals.shopify.session || response.locals.shopify
        const shop = session.shop.split(".")[0];
        let uploadPromises = [];
        if (request.files?.length) {

            request.files.forEach(file => {
                const storageUuid = uuidv4();
                const fileContent = file.buffer;
                const originalname = file.originalname;
                const extension = path.extname(originalname);
                const type = file.mimetype;
                const key = `${storageUuid}${extension}`;
                const params = {
                    Bucket: `${process.env.S3_BUCKET}/${shop}`,
                    Key: key,
                    Body: fileContent,
                    ACL: "public-read",
                    ContentType: type
                };

                // Create a promise for each file upload
                const uploadPromise = new Promise((resolve, reject) => {
                    s3.putObject(params, (err, data) => {
                        if (err) {
                            console.error("Error uploading image:", err);
                            reject(err);
                        } else {
                            const fileUrl = `${process.env.S3_BASEURL}/${shop}/${key}`;
                            resolve({id: storageUuid, url: fileUrl});
                        }
                    });
                });
                uploadPromises.push(uploadPromise);
            });
        }
        console.log(request.body.partnerId);


        if (uploadPromises.length > 0) {

            // Wait for all uploads to complete
            const uploadedFiles = await Promise.all(uploadPromises);
            const fileType = uploadedFiles[0].url.split('.').pop()
            console.log(fileType, "fileType")
            if (fileType === 'jpeg' || fileType === 'png' || fileType === "jpg") {
                console.log("condition hit")
                await ImageGallery.create({
                    partnerId: request.body.partnerId,
                    imgScr: uploadedFiles[0].url
                })
            }

            return sendResponse(response, statusCode.OK, true, SuccessMessage.UPLOAD_FILE_SUCCESS, uploadedFiles);

        } else {
            return sendResponse(response, statusCode.BAD_REQUEST, false, ErrorMessage.UPLOAD_FILE_FAILURE);
        }
    } catch (error) {
        console.log(error);
        return sendResponse(response, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


// delete file by key
exports.fileDelete = async (request, response) => {
    try {
        const session = response.locals.shopify.session || response.locals.shopify
        const shop = session.shop.split(".")[0];
        const imageKey = request.query.imageKey; 
        s3.deleteObject({
            Bucket: `${process.env.S3_BUCKET}/${shop}`, //'your-bucket-name',
            Key: imageKey   //(path) of the file to delete
        }, function (err, data) {
            if (err) {
                console.log("Error in Image Delete ", err);
            }
        })
        return sendResponse(response, statusCode.OK, true, SuccessMessage.DATA_DELETED);
    } catch (error) {
        console.log(error);
        return sendResponse(response, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}

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
            Delete: {Objects: []}
        };
        listedObjects.Contents.forEach(({Key}) => {
            deleteParams.Delete.Objects.push({Key});
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
        const result = await ImageGallery.find({partnerId}).limit(request.body.limit).skip(request.body.offset)
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