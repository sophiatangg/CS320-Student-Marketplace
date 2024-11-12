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

const getUser = async ({ setter }) => {
	if (!setter) {
		console.log("Missing setter. Check code.");
		return;
	}

	// Check for an active session first
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		// console.log("No active session. User needs to sign in.");
		setter(false);

		return;
	}

	// Fetch the user if there's an active session
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		console.error("Error fetching user:", error.message);
		setter(false);
	} else {
		const user = data?.user;
		setter(user && user.email && user.email.endsWith("@umass.edu"));
	}
};

export { getUser, signInWithGoogle };
