const schema = require("./customerSchema.js");
const { statusCode } = require("../constant/statusCodes.js");



exports.login = async (req, res, next) => {
    const { error } = schema.login.validate(req.body);
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
