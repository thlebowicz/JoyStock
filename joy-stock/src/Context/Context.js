import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Context = React.createContext(null);

const ContextProvider = ({ children }) => {
	const [authToken, setAuthToken] = useState(sessionStorage.getItem('joystockToken') || "");
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	console.log("Creating context");

	useEffect(() => {
		console.log("Use effect in context");
		const getUsername = async () => {
			const resp = await fetch('http://localhost:3000/get-username', {
				method: 'GET',
				headers: {
					Accept: 'application.json',
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + authToken,
				},
			});
			const json = await resp.json();
			const name = await json.username;
			setUsername(name);
		};
		getUsername();
	}, []);

	console.log("auth token ", authToken);
	console.log("username ", username);

	const logout = () => {
		console.log("Logging out", username);
		sessionStorage.removeItem('joystockToken');
		setAuthToken("");
		setUsername("");
		navigate("/");
	}

	return (
		<Context.Provider
			value={{
				authToken,
				username,
				setAuthToken,
				setUsername,
				logout,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export { Context, ContextProvider };