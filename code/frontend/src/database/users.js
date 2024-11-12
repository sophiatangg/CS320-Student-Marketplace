import { supabase } from "@database/supabaseClient";

const signInWithGoogle = async () => {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "http://localhost:6969",
		},
	});

	if (error) {
		console.error("Error signing in:", error.message);
	}
};

const setUser = (setter) => {
	if (!setter) {
		console.log("Missing setter function. Check code.");
		return;
	}

	supabase.auth.getSession().then(({ data: { session } }) => {
		setter(session);
	});

	const {
		data: { authListener },
	} = supabase.auth.onAuthStateChange((_event, session) => {
		setter(session);
	});

	return authListener;
};

const signOut = async (e) => {
	if (e) e.preventDefault();

	const data = await supabase.auth.signOut();
	return data;
};

export { setUser, signInWithGoogle, signOut };
