const Joi = require('joi');
const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;


const auth = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().min(8).required().messages({
		"string.min": `Password should have a minimum length of 8 characters`,
		"string.base": `Password should have an uppercase, lowercase and digit`,
		"string.pattern.base": `Password should have an uppercase, lowercase and digit`,
		"string.empty": `Password cannot be empty`,
		"string.required": `Password is required`,
	}),
});

const user = Joi.object({
	username: Joi.string(),
	password: Joi.string().min(8).required().messages({
		"string.min": `Password should have a minimum length of 8 characters`,
		"string.base": `Password should have an uppercase, lowercase and digit`,
		"string.pattern.base": `Password should have an uppercase, lowercase and digit`,
		"string.empty": `Password cannot be empty`,
		"string.required": `Password is required`,
	}),
});


module.exports = {auth}
