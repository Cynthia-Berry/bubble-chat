//SOURCE: https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
const AuthTokenModel = require('../../../models/auth');
const TokenService = require('../../services/token');
const TokenResponse = require('../responses/auth');


const TokenValidator = {
	validateAuth: (req, res, next) => {
		if (req.headers && req.headers['authorization']) {
			TokenService.verifyJWT(req, res, req.headers['authorization'], async data => {
				await AuthTokenModel.findOne({userId: data.userId}).then(user => {
					if (user['userId'].toString() === data['userId']) {
						res.locals.tokenOwner = data;
						next();
					} else {
						const response = TokenResponse.tokenNotFound();
						res.status(response.status).json({status: response.type, message: response.message});
					}
				}).catch(() => {
					const response = TokenResponse.tokenExpired();
					res.status(response.status).json({status: response.type, message: response.message});
				});
			});
		} else {
			const response = TokenResponse.tokenNotFound();
			res.status(response.status).json({status: response.type, message: response.message});
		}
	},
	
}

module.exports = TokenValidator;

