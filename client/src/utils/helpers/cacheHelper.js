import encryptHelper from "./encryptHelper";

const CacheHelper = {

  get: key => encryptHelper.decrypt(localStorage.getItem(key)),

  set: (key, data) => {
    const dataEncrypted = encryptHelper.encrypt(data);
    localStorage.setItem(key, dataEncrypted);
  },

  remove: key => localStorage.removeItem(key),

  clear: () => localStorage.clear()

};

export default CacheHelper;
