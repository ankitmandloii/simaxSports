const services = require("../services/auth.service.js");


// Response handlers
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");


exports.signUp = async (req, res) => {
    try {
      
        const userName = req.body.userName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const password = req.body.password;
        const role = req.body.role;
        
    
        //console.log("userName",userName);
        //console.log("email",email);
        //console.log("phoneNumber",phoneNumber);
        //console.log("password",password);
        //console.log("role",role);
       
        const result = await services.signUp(userName, email, phoneNumber, password, role);
        if (!result) {
            //console.log(result, "INTERNAL_SERVER_ERROR")
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.USER_ALREADY_EXIST);
        }
        return sendResponse(res, statusCode.OK, true, SuccessMessage.SIGNUP_SUCCESS, result);
    } catch (error) {
        //console.log(error, "errrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};




// // create access token controller
exports.login = async (req, res) => {
    try {
        const {email , password} = req.body;
       
        
       
        const result = await services.login(email, password);
        if (!result) {
            return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
        }
        return sendResponse(res, statusCode.OK, true, SuccessMessage.LOGIN_SUCCESS, result);
    } catch (error) {
        //console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


