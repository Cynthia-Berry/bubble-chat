import axios from 'axios';
import CacheHelper from "../helpers/cacheHelper";
import TokenHelpers from "../helpers/tokenHelper";
import CookieHelper from "../helpers/cookieHelper";
import {Configs, GeneralAppInfo} from "../helpers/constants.js";

const instance = axios.create({baseURL: GeneralAppInfo.BASE_URL});

instance.interceptors.request.use(config => {
  let token = TokenHelpers.getToken();
  let headers = {...config.headers, 'Content-Type': 'application/json', Authorization: `JWT ${token}`};
  if (TokenHelpers.checkIfLoggedIn()) config.headers = headers;
  else config.headers = {...config.headers, 'Content-Type': 'application/json'};
  return config;
}, error => Promise.reject(error));

instance.interceptors.response.use(response => response, error => {
  let token = TokenHelpers.getToken();
  if (error.response.status === 401 && token) {
    CookieHelper.remove(Configs.KEY);
    CookieHelper.remove(Configs.USER_ID);
    CacheHelper.clear();
    window.location.href = '/auth/login';
  } else return error.response ? error.response : error.message;
});

export {instance};