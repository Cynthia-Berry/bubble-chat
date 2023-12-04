const errorCodes = require("../enums/errorCodes.enum");
const successCodes = require("../enums/successCodes.enum");

const ChatResponse = {
	chatError() {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: 'An error occured while fetching chats'
		}
	},
	chatSuccess() {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: 'Chats and resources Fetched Successfully'
		}
	},
}

module.exports = ChatResponse;
