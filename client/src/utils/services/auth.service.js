import APIService from "./api.service.js";
import {Configs} from "../helpers/constants.js";
import TokenHelper from "../helpers/tokenHelper.js";
import CacheHelper from "../helpers/cacheHelper.js";
import CookieHelper from "../helpers/cookieHelper.js";


export const setLoggedInUser = async userToken => {
	await TokenHelper.saveToken(userToken);
};

export const removeLoggedInUser = async () => {
	await APIService.logout();
	CookieHelper.remove(Configs.KEY);
	CacheHelper.clear();
	window.location.href = "/auth/login";
};