const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const TokenModel = require('../models/auth');
const logger = require("../middlewares/utils/logger");
const TokenService = require("../middlewares/services/token");
const Configs = require("../middlewares/helpers/enums/configs.enum");
const AuthResponse = require("../middlewares/helpers/responses/auth");
const {databaseError} = require("../middlewares/helpers/responses/database");


const AuthController = {
	logout: (req, res) => {
		const id = TokenService.getValue(req, 'userId');
		TokenModel.deleteMany({userId: id}, async(err) => {
			if(err) {
				const response = databaseError(err);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = AuthResponse.userSuccessfullyLoggedOut();
				res.status(response.status).json({status: response.type, message: response.message});
			}
		})
	},

	login: (req, res) => {
		try {
			const {username, password} = req.body;

			UserModel.findOne({username: username.toLowerCase()}).then(async user => {
				const encryptedUserPassword = await bcrypt.compare(password, user.password);

				if(!user || !encryptedUserPassword) {
					const response = AuthResponse.logInError()
					return res.status(response.status).json({status: response.type, message: response.message});
				} else{
					const response = AuthResponse.LoginResponse();
					const userToken = jwt.sign(
						{userId: user._id, username: user.username}, process.env.TOKEN_KEY, {expiresIn: Configs.JWT_EXPIRE_PERIOD}
					);
					const hours = moment().add(6, "hours");
					const update = {$set: {token: userToken, expireDate: hours, userId: user._id}};
					const options = {upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true};

					await TokenModel.findOneAndUpdate({userId: user._id}, update, options);
					logger.info(`[SUCCESS]: ${response.message}`);
					res.status(response.status).json({
						status: response.type, message: response.message, token: userToken,
					});
				}
			});

		} catch(error) {
			const response = databaseError(error);
			logger.error(`[FAILED]: ${response.message}`);
			res.status(response.status).json({status: response.type, message: response.message});
		}
	},

	register: async(req, res) => {
		const isUserExist = await UserModel.findOne({username: req.body.username.toLowerCase()});
		if(isUserExist) {
			const response = AuthResponse.userExistError();
			logger.error(`[FAILED]: ${response.message}`);
			return res.status(response.status).json({status: response.type, message: response.message});
		} else {
			const {username, password} = req.body;
			const encryptedUserPassword = await bcrypt.hash(password, Configs.BCRYPT_SALT_RATE);

			const userObject = await new UserModel({username: username.toLowerCase(), password: encryptedUserPassword});
			userObject.save().then(async() => {
				const userToken = jwt.sign(
					{userId: userObject._id, username: userObject.username},
					process.env.TOKEN_KEY, {expiresIn: Configs.JWT_EXPIRE_PERIOD}
				);
				const hours = moment().add(6, "hours");
				const update = {$set: {token: userToken, expireDate: hours, userId: userObject._id}};
				const options = {upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true};
				//res.cookies("token", userToken).status(response.status).json({status: response.type, message: response.message, token: response.data})

				await TokenModel.findOneAndUpdate({userId: userObject._id}, update, options);
				const response = AuthResponse.registerResponse(userToken);
				logger.info(`[SUCCESS]: ${response.message}`);
				res.status(response.status).json({
					status: response.type, message: response.message, token: response.data,
				});
			}).catch((error) => {
				const response = databaseError(error);
				logger.error(`[FAILED]: ${response.message}`);
				res.status(response.status).json({status: response.type, message: response.message});
			})
		}
	},
}

module.exports = AuthController;
