const User = require("../model/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const emailConfig = require('../config/email.js');
const emailTemplates = require("../utils/emailTemplate.js");
const nodemailer = require('nodemailer');







// exports.signUp = async (userName, email, phoneNumber, password) => {

//   try {


//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const newUser = {
//       "userName": userName,
//       "email": email,
//       "phoneNumber": phoneNumber,
//       "password": hashedPassword // Store passwords securely (e.g., using bcrypt)
//     };

//     const userCreated = await User.create(newUser);
//     //console.log("created USerData--> ", userCreated);
//     return userCreated;
//   } catch (error) {
//     // Handle errors (e.g., duplicate email)
//     //console.error('Error creating user:', error);
//     return false;
//   }


// };



// exports.login = async (email, password) => {
//   try {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Find the user in the database
//     const user = await User.findOne({ email });
//     //console.log("user--->", user);
//     // If user not found, return 401 Unauthorized
//     if (!user) {
//       //console.log("user--->1", user);
//       return false;
//     }

//     //console.log("hashedPassword",hashedPassword);
//     //console.log("user.password",user.password);

//     if (await bcrypt.compare(hashedPassword, user.password)) {
//       return user;
//     } else {
//       return false;
//     }

//   } catch (error) {
//     //console.error(error);
//     return false;
//   }

// };



// exports.login = async (email, password) => {
//   try {

//     const user = await User.findOne({ email });
//     if (!user) {

//       return false;
//     }


//     const passwordsMatch = await bcrypt.compare(password, user.password);
//     if (!passwordsMatch) {

//       return false;
//     }


//     return user;

//   } catch (error) {
//     //console.error('Login error:', error);
//     return false;
//   }
// };

exports.findUserForLogin = async (email) => {
  try {
    const user = await User.findOne({ email }).lean(); // lean() returns plain JS object, faster if no methods needed
    return user || null;
  } catch (error) {
    console.error("Find User Error:", error);
    throw error;
  }
};

exports.passwordCompareForLogin = async (user, password) => {
  try {
    

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) return false;

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      SECRET_KEY,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Return user info + token
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.userName,
      },
      token,
    };

  } catch (error) {
    console.error('Login error:', error);
    throw error; 
  }
};


exports.incrementTokenVersion = async (userId) => {
  const user = await User.findById(userId); // or Sequelize equivalent
  user.tokenVersion += 1;
  await user.save();
};

exports.signUp = async (userName, email, phoneNumber, password,role) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
      role
    };

    const userCreated = await User.create(newUser);
    return userCreated;
  } catch (error) {
    //console.error('Error creating user:', error);
    return false;
  }
};




exports.sendEmailForOtpverification = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    let mailOptions = emailTemplates.otpEmailTemplate(email, otp);

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent for Verification OTP: ${info.response}`);
    return true;
  }
  catch (e) {
    console.error(
      `Error in email send For OTP: ${e}`,
    );
    return false;
  }
}
