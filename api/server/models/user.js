const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true
	},
}, {timestamps: true});


userSchema.plugin(uniqueValidator);
const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;
