const env = require("dotenv");
env.config();

function extractName(email) {
  let namePart = email.split("@")[0];  // Get the part before '@'
  let formattedName = namePart.replace(/[\.\-_]/g, " ")  // Replace dots, hyphens, underscores with spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
  return formattedName;
}

exports.sendEmailTamplate = (customerEmail,companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link) => {

  // const userName = extractName(customerEmail);
  const designName = designname || "";
  const data = {
    from: process.env.SMTP_USER,
    to: `${customerEmail}`,
    subject: `Your Design ${designName} has been updated!`,
    html: `
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4;">
    <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
      <tr>
        <td style="padding: 20px 0;">
          <img src="https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755783418078_image_4.png" alt="SimaxDesign Logo" style="display: block; margin: 0 auto; width: 150px;">
        </td>
      </tr>
      <tr>
        <td style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 24px; color: #333; text-align: center; margin-bottom: 20px;">We've Saved Your Design!</h1>
          <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">Your Design is really shaping up! Choose the right product to have it printed on, or jump in to the design studio and make your final edits.</p>
          <p style="font-size: 16px; color: #333; text-align: center; font-weight: bold; margin-top: 30px;">Design Name: ${designName}</p>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
            <tr>
              <td align="center" style="padding: 10px;">
                <img src=${frontSrc} alt="design_front" style="display: block; width: 250px; height: auto;">
              </td>
              <td align="center" style="padding: 10px;">
                <img src=${backSrc} alt="design_back" style="display: block; width: 250px; height: auto;">
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
            <tr>
              <td align="center" style="padding: 10px;">
                <a href="${edit_design_link}" style="display: inline-block; padding: 12px 25px; background-color: #005bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Edit Design</a>
              </td>
              <td align="center" style="padding: 10px;">
                <a href="${add_to_cart_link}" style="display: inline-block; padding: 12px 25px; background-color: #005bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Add To Cart</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background-color: #e6e6e6; padding: 20px; text-align: center; margin-top: 20px; border-radius: 10px;">
          <p style="font-size: 16px; color: #555; margin-bottom: 10px;">We're here to help you 7 days a week</p>
          <p style="font-size: 16px; color: #555;">Call <a href="tel:${phoneNumber}" style="color: #007bff; text-decoration: none;">${phoneNumber}</a> or email <a href="mailto:${companyEmail}" style="color: #007bff; text-decoration: none;">${companyEmail}</a> to chat with an expert now & create your masterpiece!</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #FFFFFFFF; padding: 20px; text-align: center;">
          <img src="https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755783418078_image_4.png" alt="SimaxDesign Footer Logo" style="display: block; margin: 0 auto; width: 120px; margin-bottom: 15px;">
          <p style="font-size: 12px; color: #ccc; margin-bottom: 5px;">SimaxDesign by Simax Transfers</p>
          <p style="font-size: 12px; color: #ccc; margin-bottom: 15px;">2/27 Commerce Way, Suite 100, Philadelphia, PA 19154</p>
          <p style="font-size: 12px; color: #ccc;">This message was sent to <a href="mailto:${customerEmail}" style="color: #007bff; text-decoration: none;">${customerEmail}</a></p>
          <p style="font-size: 12px; color: #ccc;">No longer interested? <a href="${unsubscribe_link}" style="color: #007bff; text-decoration: none;">Unsubscribe</a></p>
        </td>
      </tr>
    </table>
  </body>
`,
  };

  return data;
};