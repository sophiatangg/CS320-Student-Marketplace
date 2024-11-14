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
		console.error("No active session found or error fetching session:", sessionError?.message);
		return;
	}

	const user = sessionData.session.user;
	const {
		id,
		email,
		user_metadata: { full_name, avatar_url },
	} = user;

	const tableName = "User";

	// Check if user already exists in the users table
	const { data: existingUser, error: fetchError } = await supabase.from(tableName).select("id").eq("id", id).maybeSingle();

	if (fetchError) {
		console.error("Error checking if user exists:", fetchError.message);
		return;
	}

	// If user does not exist, insert them
	if (!existingUser) {
		const { error: insertError } = await supabase.from(tableName).insert({
			id,
			email,
			name: full_name,
			avatar_url,
		});
	} else {
		console.log("User already exists in the database, skipping insert.");
	}
};

const signOut = async (e) => {
	if (e) e.preventDefault();

	const data = await supabase.auth.signOut();
	return data;
};

export { insertUserData, setUser, signInWithGoogle, signOut };
