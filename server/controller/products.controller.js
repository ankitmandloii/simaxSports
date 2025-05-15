const services = require("../services/products.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");


exports.productList = async (req, res) => {
    try {

        const dataLimit = req.body.limit;
        
        const result = await services.getProductsList(dataLimit,false);
        if (!result) {
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.DATA_NOT_FOUND);
        }
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


exports.productFilter = async (req, res) => {
    try {
          // Extract the product title from body
    const title = req.body.title;

    // Set the limit for the number of items to fetch
    const limit = req.body.limit;

    // Determine if a cursor is provided to fetch results after a specific point
    const cursor = req.body.cursor;
    const isCursor = cursor ? `after:"${cursor}",` : "";
        const result = await services.getProductFilter(title, limit, isCursor);

        
        if (!result) {
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.PRODUCT_FETCHED);
        }
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};




//getCollection List Api 

exports.getAllCollectionList = async (req, res) => {
    try {
        // Set the limit for the number of items to fetch
        const limit = req.body.limit;
       
        // Determine if a cursor is provided to fetch results after a specific point
        const cursor = req.body.cursor;
        
        //Calling over collection list service to get the list of collections
        const result = await services.getAllCollectionList(limit, cursor);
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


//product by collectionId 

exports.productsByCollectionId = async (req, res) => {
    try {
      
        const collectionId = req.params.id;
        const limit = req.body.limit;
        const cursor = req.body.cursor;
       
        const result = await services.getProductsByCollectionId(limit,collectionId,cursor)
        if (!result) {
            return sendResponse(res, statusCode.NOT_FOUND, false, ErrorMessage.DATA_NOT_FOUND);
        }
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result)
    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}