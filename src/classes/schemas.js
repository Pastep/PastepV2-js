const Joi = require("joi");

const userSchema = Joi.object({
    username: Joi.string().alphanum().max(200).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
    username: Joi.string().alphanum().max(200),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    email: Joi.string().email(),
}).xor("username", "email");

const getSchema = Joi.object({
    username: Joi.string().alphanum().max(200),
    email: Joi.string().email(),
    id: Joi.number(),
    new_password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
}).xor("username", "email", "id");

const pasteSchema = Joi.object({
    id: Joi.number(),
    name: Joi.string().alphanum().max(200).required(),
    title: Joi.string().max(200).required(),
    content: Joi.string().required(),
    mode: Joi.number().required(),
    language: Joi.number().required(),
    readme: Joi.string().required(),
    password: Joi.string().alphanum(),
});

module.exports.loginSchemaValidate = (parameters) => {
    const result = loginSchema.validate(parameters);
    return result;
};

module.exports.userSchemaValidate = (parameters) => {
    const result = userSchema.validate(parameters);
    return result;
};

module.exports.getSchemaValidate = (parameters) => {
    return getSchema.validate(parameters);
};

module.exports.pasteSchemaValidate = (parameters) => {
    return pasteSchema.validate(parameters);
};