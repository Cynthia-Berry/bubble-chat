import {Navigate, Outlet, Route, Routes, BrowserRouter as Router} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import TokenHelper from "./utils/helpers/tokenHelper.js";


import Login from "./pages/auth/Login.jsx";
import Chats from "./pages/dashboard/Chats.jsx";
import Register from "./pages/auth/Register.jsx";
import Error404 from "./pages/misc/error404.jsx";


function App() {
	const AuthenticatedRoutes = () => {
		if(TokenHelper.checkIfLoggedIn()) return <Outlet/>
		else return <Navigate to="/auth/login" replace/>;
	};

	return (
		<Router>
			<ToastContainer position="top-right" theme="light" autoClose={5000} style={{zIndex: '999999999999'}}
											hideProgressBar={false} newestOnTop={false} rtl={false} closeOnClick={false}
											pauseOnFocusLoss draggable pauseOnHover/>
			<Routes>
				<Route path="/auth">
					<Route path="login" element={<Login/>}/>
					<Route path="register" element={<Register/>}/>
				</Route>

				<Route element={<AuthenticatedRoutes/>}>
					{['/', 'chats', 'dashboard'].map(path => <Route path={path} key={path} element={<Chats/>}/>)}
				</Route>
				<Route path="*" element={<Error404/>}/>
			</Routes>
		</Router>
	)
}

export default App
