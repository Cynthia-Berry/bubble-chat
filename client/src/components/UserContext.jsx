import {createContext, useState} from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({children}) => {
	const [id, setId] = useState(null);
	const [username, setUsername] = useState(null);

	return (
		<UserContext.Provider value={{id, setId, username, setUsername}}>{children}</UserContext.Provider>
	)
}