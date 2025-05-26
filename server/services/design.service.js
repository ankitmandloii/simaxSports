const nodemailer = require('nodemailer'); 
const emailConfig =  require('../config/email.js');
const emailTemplates = require('../utils/emailTemplate.js');


exports.sendEmailDesign = async (email, frontSrc, backSrc, designName) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);
     

    let mailOptions = emailTemplates.sendEmailTamplate(email, frontSrc,backSrc, designName);


    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return true;
  }
  catch (e) {
    console.error(
      `Error in email send: ${e}`,
    );
    return false;
  }
}

