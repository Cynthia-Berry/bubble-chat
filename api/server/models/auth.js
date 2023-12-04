const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const authTokenSchema = new Schema({
	token: {
		type: String,
		required: true
	},
	expireDate: {
		type: Date,
		default: moment().add(2, "hour")
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: 'users'
	}
}, {timestamps: true});


authTokenSchema.plugin(uniqueValidator);
const TokenModel = mongoose.model('Tokens', authTokenSchema);

module.exports = TokenModel;