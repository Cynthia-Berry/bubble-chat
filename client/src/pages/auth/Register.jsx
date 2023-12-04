import {useContext, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import APIService from "../../utils/services/api.service.js";
import {UserContext} from "../../components/UserContext.jsx";
import CookieHelper from "../../utils/helpers/cookieHelper.js";
import EncryptHelper from "../../utils/helpers/encryptHelper.js";
import {Configs, Loading} from "../../utils/helpers/constants.js";
import {setLoggedInUser} from "../../utils/services/auth.service.js";

const Register = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const {setUsername: setLoggedInUsername, setId} = useContext(UserContext);

	const handleRegistration = async(event) => {
		event.preventDefault();
		const {data: responseData} = await APIService.register({username, password});
		if(responseData.status !== Loading.CREATED) toast.error(responseData.message);
		else {
			const user = EncryptHelper.jwtDecode(responseData.token);
			await setLoggedInUser(responseData.token, user);
			await CookieHelper.set(Configs.USER_ID, user.userId);
			setId(user.userId);
			setLoggedInUsername(user.username);
			navigate('/');
			toast.success(responseData.message);
		}
	}

	return (
		<div className="bg-blue-50 h-screen flex items-center">
			<div className="w-72 mx-auto mb-12">
				<form>
					<input type="text" placeholder="username" className="block w-full p-2 mb-2 rounded-sm border"
								 value={username} onChange={event => setUsername(event.target.value)}/>
					<input type="password" placeholder="password" className="block w-full p-2 mb-2 rounded-sm border"
								 value={password} onChange={event => setPassword(event.target.value)}/>
					<button className="bg-blue-500 text-white block w-full p-2 mb-2 rounded-sm"
									onClick={event => handleRegistration(event)}>
						Register
					</button>
				</form>
				<div className="text-center mt-2">
					<small>Already have an account <NavLink to="/auth/login">Login</NavLink></small>
				</div>
			</div>
		</div>
	)
};

export default Register;