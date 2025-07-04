const services = require("../services/design.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const AdminSettings = require("../schema/adminSettingsSchema.js");
const { emitSettingUpdate } = require('../socket.js');


exports.sendEmailDesign = async (req, res) => {
    try {
        console.log("sendEmailDesign");
        const email = req.body.email;
        const frontSrc = req.body.frontSrc;
        const backSrc = req.body.backSrc;
        const designName = req.body.designName;
        if (!email) {
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.EMAIL_REQUIRED);
        }
        const EmailSendSuccess = await services.sendEmailDesign(email, frontSrc, backSrc, designName);
        if (!EmailSendSuccess) {
            return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.ERROR_SENDING_MAIL);
        }
        return sendResponse(res, statusCode.OK, true, SuccessMessage.EMAIL_SEND_SUCCESS, EmailSendSuccess);
    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


exports.saveSettings = async (req, res) => {
    try {

        const existing = await AdminSettings.findOne();
        if (existing) {
            await AdminSettings.updateOne({}, { $set: req.body });
            emitSettingUpdate(req.body);

            return sendResponse(res, statusCode.OK, true, "Settings updated");
        } else {
            await AdminSettings.create(req.body);
            emitSettingUpdate(req.body);
            return sendResponse(res, statusCode.OK, true, "Settings created");

        }
    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


exports.getSettings = async (req, res) => {
    try {
        const settings = await AdminSettings.findOne();

        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, settings || {});

    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};