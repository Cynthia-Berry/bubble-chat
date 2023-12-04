const errorCodes = require("../enums/errorCodes.enum");
const successCodes = require("../enums/successCodes.enum");

const UserResponse = {
	userError() {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: 'User with the information does not exists'
		}
	},

	userSuccess() {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: 'User information or resources Fetched Successfully'
		}
	},
}

module.exports = UserResponse;
