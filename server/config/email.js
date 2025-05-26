module.exports ={
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, 
    secure: true,
    auth: 
    {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
}



// exports.emailConfig = {
//   host: "smtp.ethereal.email",
//   port: 465,
//   secure: true, // ✅ use SSL
//   auth: {
//     user: "maddison53@ethereal.email",
//     pass: "jn7jnAPss4f63QBp6D",
//   },
// };
