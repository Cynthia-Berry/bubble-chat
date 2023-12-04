import {instance as Axios} from './axios.service';

const APIService = {
	register(payload) {
		return Axios({
			method: 'POST',
			url: `auth/register`,
			data: payload
		});
	},

	login(payload) {
		return Axios({
			method: 'POST',
			url: `auth/login`,
			data: payload
		});
	},

	logout() {
		return Axios({
			method: 'GET',
			url: `auth/logout`,
		});
	},

	getAllUsers(){
		return Axios({
			method: 'GET',
			url: `user/profile`,
		});
	},

	getMessagesById(id){
		return Axios({
			method: 'GET',
			url: `chat/messages/${id}`,
		});
	},
};

export default APIService;
