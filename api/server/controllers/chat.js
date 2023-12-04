const ChatModel = require("../models/chat");
const ChatResponse = require("../middlewares/helpers/responses/chat");
const logger = require("../middlewares/utils/logger");


const ChatController = {
	getChatByUserId: async (req, res) => {
		const {id} = req.params, selfId = res.locals.tokenOwner['userId'];

		const messages = await ChatModel.find({
			sender: {$in: [selfId, id]}, recipient: {$in: [selfId, id]}
		}).sort({createdAt: 1});

		if(!messages) {
			const response = ChatResponse.chatError();
			logger.error(`['FAILED']: ${response.message}`);
			res.status(response.status).json({status: response.type, message: response.message});
		}else{
			const response = ChatResponse.chatSuccess();
			logger.info(`['SUCCESS']: ${response.message}`);
			res.status(response.status).json({status: response.type, message: response.message, data: messages})
		}
	}
}

module.exports = ChatController;