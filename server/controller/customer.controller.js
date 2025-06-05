const services = require("../services/customer.service.js");
const {sendResponse} = require("../utils/sendResponse.js");
const {SuccessMessage, ErrorMessage} = require("../constant/messages.js");
const {statusCode} = require("../constant/statusCodes.js");






//############################################################# Order  #########################################################


// remove customer favorite product in list
exports.getOrderList = async (req, res) => {
    try {
      
        const result = await services.getOrderList();
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        console.log(error);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}

// // cancel shop order
// exports.cancelOrder = async (req, res) => {
//     try {
//         const session = res.locals.shopify.session || res.locals.shopify;
//         const orderId = req.query.orderId
//         const result = await services.cancelOrder(orderId, session);
//         return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
//     } catch (error) {
//         console.log(error);
//         return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
//     }
// }

// //############################################################# Discount  #########################################################

