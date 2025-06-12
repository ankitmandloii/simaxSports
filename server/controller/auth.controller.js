const services = require("../services/auth.service.js");
const bcrypt = require('bcrypt');

// Response handlers
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const User = require("../model/userSchema.js");
const ActiveUser = require('../model/activeUserSchema.js');
const { dbConnection } = require("../config/db.js");
// const client = require('../utils/redisClient.js');

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
// exports.login = async (req, res) => {
//     try {
//         const {email , password} = req.body;



//         const result = await services.login(email, password);
//         if (!result) {
//             return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
//         }
//         return sendResponse(res, statusCode.OK, true, SuccessMessage.LOGIN_SUCCESS, result);
//     } catch (error) {
//         //console.log(error)
//         return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
//     }
// };




exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await services.findUserForLogin(email);

    if (!user) {
      return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.USER_NOT_FOUND);
    }

    if (user.role !== role) {
      return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.NOT_AUTHORIZED);
    }


    const loginResult = await services.passwordCompareForLogin(user, password);

    if (!loginResult) {
      return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    return sendResponse(res, statusCode.OK, true, SuccessMessage.LOGIN_SUCCESS, loginResult);

  } catch (error) {
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};


exports.adminChangePassword = async (req, res) => {
  try {

    const { email, oldPassword, newPassword } = req.body;

    // Fetch the user
    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.ADMIN_NOT_FOUND, email);

    // Ensure the user is the admin
    if (user.role !== 'admin') {
      return sendResponse(res, statusCode.FORBIDDEN, false, ErrorMessage.ONLY_ADMIN_CAN_CHANGE_PASSWORD, email);
    }

    // Validate current password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.WRONG_EMAIL_OR_PASSWORD, email);

    // Prevent reusing the same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.NEWPASSWORD_SAME_AS_OLD, email);

    // Hash and update the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedNewPassword;
    await user.save();

    return sendResponse(res, statusCode.OK, true, SuccessMessage.PASSWORD_CHANGED_SUCCESSFULLY, email);
  } catch (error) {
    console.error('Admin change password error:', error);
    return false;
  }
};





//Using Pay (Redis ex- Upstash)
// exports.trackAnonymousUser = async (req, res) => {
//   console.log("trackAnonymousUser CALLED1");
//   try {
//     const { anonId } = req.body;
//     if (!anonId) return res.status(400).json({ message: 'anonId required' });
//     console.log("anonId", anonId)
//     await client.set(`activeUser:${anonId}`, 'true', { EX: 300 }); // expires in 5 minutes
//     res.status(200).json({ message: 'Activity tracked' });
//   } catch (err) {
//     console.error('Activity Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


//Using Pay (Redis ex- Upstash)
// exports.getActiveUserCount = async (req, res) => {
//     console.log("getActiveUserCount called1");
//   try {
//     const keys = await client.keys('activeUser:*');
//     res.status(200).json({ activeUserCount: keys.length });
//   } catch (err) {
//     console.error('Count Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// working last
// exports.trackAnonymousUser = async (req, res) => {
//   console.log("trackAnonymousUser CALLED2");
//   try {
//     await dbConnection();
//     const { anonId } = req.body;
//     if (!anonId) return res.status(400).json({ message: 'anonId required' });
//     console.log("anonId", anonId)

//     await ActiveUser.findOneAndUpdate(
//       { anonId },
//       { lastActive: new Date() },
//       { upsert: true }
//     );

//     res.status(200).json({ message: 'Activity tracked' });
//   } catch (err) {
//     console.error('Activity Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.trackAnonymousUser = async (req, res) => {
  try {
    await dbConnection();

    const { anonId, userAgent, language, timezone, screen, platform } = req.body;
    if (!anonId) return res.status(400).json({ message: 'anonId required' });

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    await ActiveUser.findOneAndUpdate(
      { anonId },
      {
        lastActive: new Date(),
        userAgent,
        language,
        timezone,
        screen,
        platform,
        ip
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Activity tracked' });
  } catch (err) {
    console.error('Activity Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getActiveUserCount = async (req, res) => {
  console.log("getActiveUserCount called2");
  try {
    const cutoff = new Date(Date.now() - 5 * 60 * 1000); // last 5 min
    const activeUsersData = await ActiveUser.countDocuments({ lastActive: { $gte: cutoff } });
    res.status(200).json({ activeUserCount: activeUsersData });
  } catch (err) {
    console.error('Count Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};