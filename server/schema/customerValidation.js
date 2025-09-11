const schema = require("./customerSchema.js");
const { statusCode } = require("../constant/statusCodes.js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const crypto = require('crypto');
// const User = require("../model/userSchema.js");



exports.login = async (req, res, next) => {
    const { error } = schema.loginSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};

exports.customerRegister = async (req, res, next) => {
    const { error } = schema.customerRegisterSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};



// const findUserById = async (id) => {
//   return await User.findById(id);
// };


exports.verifyToken = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Get token from Bearer <token>

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // const user = await findUserById(decoded.id); // implement this

    // if (!user) {
    //   return res.status(401).json({ success: false, message: 'User not found.' });
    // }
    // // 🔑 key check
    // if (decoded.tokenVersion !== user.tokenVersion) {
    //   return res.status(401).json({ success: false, message: 'Session revoked. Please login again.' });
    // }

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

exports.verifyShopifyWebhook = async (req, res, next) => {

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];

  const rawBody = req.body;


  if (!Buffer.isBuffer(rawBody)) {
    console.error('Invalid body format');
    return res.status(400).send('Invalid body format');
  }

  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');


  if (generatedHash !== hmacHeader) {
    return res.status(401).send('Unauthorized');
  }

  try {
    req.body = JSON.parse(rawBody.toString('utf8'));

    next();
  } catch (err) {
    console.error('JSON Parse Error:', err.message);
    return res.status(400).send('Invalid JSON');
  }
}
