const services = require("../services/imageOperations.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const fs = require('fs');
// const sharp = require('sharp');

exports.convertToPng = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const inputPath = req.file.path;

    try {
        // const metadata = await sharp(inputPath).metadata();
        // console.log(metadata.format)
        const outputPath = await services.convertToPng(inputPath);

        res.download(outputPath, 'converted.png', (err) => {
            // Clean up files after sending
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
            if (err) console.error('Download error:', err);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Image conversion failed' });
    }


};
