const Joi = require("joi");

const userSchema = Joi.object({
	username: Joi.string().alphanum().max(200).required(),
	persianUsername: Joi.string().max(200),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
	email: Joi.string().email().required(),
	bio: Joi.string(),
});

const userUpdateSchema = Joi.object({
	username: Joi.string().alphanum().max(200),
	persianUsername: Joi.string().max(200).allow("").allow(null),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
	email: Joi.string().email(),
	bio: Joi.string().allow("").allow(null),
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
	token: Joi.string(),
	new_password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
}).xor("username", "email", "id", "token");

const pasteSchema = Joi.object({
	id: Joi.number(),
	name: Joi.string().alphanum().max(200).required(),
	title: Joi.string().max(200).required(),
	content: Joi.string().required(),
	mode: Joi.number().required(),
	language: Joi.string().required(),
	readme: Joi.string().default("**no readme provided**"),
	shortDescription: Joi.string().default("No description provided"),
	password: Joi.string().alphanum(),
});
const pasteUpdateSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().alphanum().max(200),
	title: Joi.string().max(200),
	content: Joi.string(),
	mode: Joi.number(),
	language: Joi.string(),
	readme: Joi.string(),
	shortDescription: Joi.string(),
	password: Joi.string().alphanum(),
});

const languageGetSchema = Joi.object({
	id: Joi.number(),
	slug: Joi.string().alphanum(),
}).xor("id", "slug");

module.exports.loginSchemaValidate = (parameters) => {
	const result = loginSchema.validate(parameters);
	return result;
};

module.exports.userSchemaValidate = (parameters) => {
	const result = userSchema.validate(parameters);
	return result;
};

module.exports.userUpdateSchemaValidate = (parameters) => {
	const result = userUpdateSchema.validate(parameters);
	return result;
};

module.exports.getSchemaValidate = (parameters) => {
	return getSchema.validate(parameters);
};

module.exports.pasteSchemaValidate = (parameters) => {
	return pasteSchema.validate(parameters);
};

module.exports.pasteUpdateSchemaValidate = (parameters) => {
	return pasteUpdateSchema.validate(parameters);
};

module.exports.languageGetSchemaValidate = (parameters) => {
	return languageGetSchema.validate(parameters);
};
