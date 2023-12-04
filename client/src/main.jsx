import React from 'react';
import ReactDOM from 'react-dom/client';
import {UserContextProvider} from "./components/UserContext.jsx";
import App from './App.jsx';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<UserContextProvider>
			<App/>
		</UserContextProvider>
	</React.StrictMode>,
)
