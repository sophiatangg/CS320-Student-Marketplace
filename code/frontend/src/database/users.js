import { supabase } from "@database/supabaseClient";

const tableName = "User";

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

const getUser = async (userId) => {
	const { data: userData, error: userError } = await supabase.from(tableName).select("*").eq("id", userId).single();

	if (userError) {
		throw Error("Error fetching user by userId.");
	}

	if (userData) {
		return userData;
	}
};

const insertUserData = async () => {
	const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

	if (sessionError || !sessionData || !sessionData.session) {
		console.error("No active session found or error fetching session:", sessionError?.message);
		return;
	}

	const user = /* sessionData.session.user;
	const*/ {
		id: sessionData.session.user.id,
		email: sessionData.session.user.email,
		user_metadata: { full_name: sessionData.session.user.full_name, avatar_url: sessionData.session.user.avatar_url },
	}; /*= user*/

	console.log(user);

	// Check if a user with the same id or email already exists
	const { data: existingUser, error: fetchError } = await supabase
		.from(tableName)
		.select("id", "email")
		.or(`id.eq.${id},email.eq.${email}`)
		.maybeSingle();

	if (existingUser) {
		return {
			message: "User data already exists. Skipped inserting.",
			error: null,
		};
	} else {
		const { error: insertError } = await supabase.from(tableName).insert({
			id,
			email,
			name: full_name,
			avatar_url,
		});

		if (insertError) {
			return {
				message: "Error inserting user",
				error: insertError,
			};
		} else {
			return {
				message: "User data insertion successful",
				error: null,
			};
		}
	}
};

const signOut = async (e) => {
	if (e) e.preventDefault();

	const data = await supabase.auth.signOut();
	return data;
};

export { getUser, insertUserData, setUser, signInWithGoogle, signOut };
