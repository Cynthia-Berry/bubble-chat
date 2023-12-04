import {Configs} from './constants';
import CookieHelper from "./cookieHelper";

const TokenHelper = {

	checkIfLoggedIn() {
		const TOKEN = CookieHelper.get(Configs.KEY);
		return !!TOKEN;
	},

	saveToken(token) {
		CookieHelper.set(Configs.KEY, token, Configs.COOKIE_EXPIRY_PERIOD);
		localStorage.setItem(Configs.KEY, token);
	},

	getToken() {
		return CookieHelper.get(Configs.KEY);
	},

}

export default TokenHelper;
