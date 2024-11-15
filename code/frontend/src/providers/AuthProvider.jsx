import { insertUserData, setUser } from "@database/users";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
	currentUser: null,
	setCurrentUser: () => {},
});

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [userChecked, setUserChecked] = useState(false);

	useEffect(() => {
		const authListener = setUser((session) => {
			setCurrentUser(session?.user ?? null);

			// Run this logic only if the user is logged in and hasn't been checked yet
			if (session && !userChecked) {
				insertUserData()
					.then((data) => {
						setUserChecked(true);
					})
					.catch((error) => {
						console.error(error);
					});
			}
		});

		return () => {
			authListener?.unsubscribe();
		};
	}, [userChecked]);

	return <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
