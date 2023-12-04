import encryptHelper from "./encryptHelper";
import Cookies from "js-cookie";

const CookieHelper = {

  get: key => {
    return encryptHelper.decrypt(Cookies.get(key));
  },

  set: (key, data, ex) => {
    const dataEncrypted = encryptHelper.encrypt(data);
    Cookies.set(key, dataEncrypted, {expires: ex});
  },

  remove: key => {
    Cookies.remove(key);
  }

}

export default CookieHelper;


