const Joi = require("joi");


exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    // _id: Joi.string().required(),
});

exports.customerRegisterSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("customer", "admin").required(),
});




