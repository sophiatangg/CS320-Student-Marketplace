import { supabase } from "@database/supabaseClient";

const USER_TABLE_NAME = "User";
const AUTH_TABLE_NAME = "auth.users";

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
	if (!userId) return;

	const { data: userData, error: userError } = await supabase.from(USER_TABLE_NAME).select("*").eq("id", userId).single();

	if (userError) {
		throw Error("Error fetching user by userId.");
	}

	if (userData) {
		return userData;
	}
};

const getAuthUser = async (userId) => {
	const { data, error } = await supabase.from(AUTH_TABLE_NAME).select("*").eq("id", userId).single();

	if (error) {
		console.error("Error fetching user:", error);
		return null;
	}

	return data;
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

	// console.log(user);

	// Check if a user with the same id or email already exists
	const { data: existingUser, error: fetchError } = await supabase
		.from(USER_TABLE_NAME)
		.select("id", "email")
		.or(`id.eq.${id},email.eq.${email}`)
		.maybeSingle();

	if (existingUser) {
		return {
			message: "User data already exists. Skipped inserting.",
			error: null,
		};
	} else {
		// We need to do this here so that logged-in users data will populate the "User" table.
		// Records in our "User" table is separate from User Authentication.
		// The separation is due to the fact that User Authentication is done through Google, not from us or supabase.
		// We are simply connecting Google's services in our supabase's Authentication.
		// We need our own user record thus, we need to fetch them from authentication's session.
		// Here, we are checking if the user is logged in and if their data is already existed in our "User" table.
		// Otherwise, we are inserting the following row to the "User" table:

		const { error: insertError } = await supabase.from(USER_TABLE_NAME).insert({
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

export { getAuthUser, getUser, insertUserData, setUser, signInWithGoogle, signOut };
