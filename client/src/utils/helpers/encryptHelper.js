import CryptoJS from 'crypto-js';
import {Configs} from './constants';

const EncryptHelper = {

  encrypt: data => {
    if (!data) return null;
    else return CryptoJS.AES.encrypt(JSON.stringify(data), Configs.KEY);
  },

  decrypt: data => {
    if (!data) return null;
    else {
      const bytes = CryptoJS.AES.decrypt(data.toString(), Configs.KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  },

  jwtDecode: data => {
    if (!data) return null;
    else if (typeof data === 'object') return data;
    else {
      const base64Url = data.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
  }

};

export default EncryptHelper;
