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

const insertUserData = async () => {
	const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

	if (sessionError || !sessionData || !sessionData.session) {
		return {
			status: "No active session found or error fetching session",
			error: sessionError,
		};
	}

	const user = sessionData.session.user;
	const {
		id,
		email,
		user_metadata: { full_name, avatar_url },
	} = user;

	const tableName = "User";

	// Check if user already exists in the users table
	const { data, error, status } = await supabase.from(tableName).upsert(
		{
			id,
			email,
			name: full_name,
			avatar_url,
		},
		{ onConflict: ["id"] }, // Prevents conflict on 'id' column
	);

	if (error) {
		return {
			error,
			status,
		};
	} else {
		return {
			data,
			status,
		};
	}
};

const signOut = async (e) => {
	if (e) e.preventDefault();

	const data = await supabase.auth.signOut();
	return data;
};

export { insertUserData, setUser, signInWithGoogle, signOut };
