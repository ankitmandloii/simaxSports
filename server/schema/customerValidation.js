const schema = require("./customerSchema.js");
const { statusCode } = require("../constant/statusCodes.js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';


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


exports.verifyToken = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Get token from Bearer <token>

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Store decoded user in request
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};