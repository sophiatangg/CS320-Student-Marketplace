import { setUser } from "@database/users";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
	currentUser: null,
	setCurrentUser: () => {},
});

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const authListener = setUser((session) => {
			setCurrentUser(session?.user ?? null);
		});

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	return <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
