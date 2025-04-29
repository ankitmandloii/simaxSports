const Joi = require("joi");


exports.login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    ConfirmPassword: Joi.string().required(),
    // _id: Joi.string().required(),
});

exports.customerRegisterSchema = Joi.object({
    userName: Joi.string().allow("", null).optional(),
    email: Joi.string().email().allow("", null).optional(),
    password: Joi.string().allow("", null).optional(),
    confirmPassword: Joi.string().allow("", null).optional(),
    phoneNumber: Joi.string().allow("", null).optional(),
});




