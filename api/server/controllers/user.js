const UserModel = require("../models/user");
const UserResponse = require("../middlewares/helpers/responses/user");
const logger = require("../middlewares/utils/logger");


const UsersController = {

	getUsers: async (req, res) => {

		const users = await UserModel.find({}, {_id: 1, username: 1});
		if(!users) {
			const response = UserResponse.userError();
			logger.error(`['FAILED']: ${response.message}`);
			res.status(response.status).json({status: response.type, message: response.message});
		}else{
			const response = UserResponse.userSuccess();
			logger.info(`['SUCCESS']: ${response.message}`);
			res.status(response.status).json({status: response.type, message: response.message, data: users})
		}
	},

	getUserById: async (req, res) => {
		const {id} = req.params;

		const user = await UserModel.findById(id);
		if(!user) {
			const response = UserResponse.userError();
			logger.error(`['FAILED']: ${response.message}`);
			res.status(response.status).json({status: response.type, message: response.message});
		}else{
			const response = UserResponse.userSuccess();
			logger.info(`['SUCCESS']: ${response.message}`);
			res.status(response.status).json({status: response.type, message: response.message, data: user})
		}
	},
}

module.exports = UsersController;