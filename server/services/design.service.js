const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.js');
const emailTemplates = require('../utils/emailTemplate.js');


exports.sendEmailDesign = async (email, companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);


    let mailOptions = emailTemplates.sendEmailTamplate(email, companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link);


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




