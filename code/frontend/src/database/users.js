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

	const user = /* sessionData.session.user;
	const*/ {
		id: sessionData.session.user.id,
		email: sessionData.session.user.email,
		user_metadata: { full_name: sessionData.session.user.full_name, avatar_url: sessionData.session.user.avatar_url },
	}; /*= user*/

	console.log(user);

	const tableName = "User";
	// Check if user already exists in the users table
	const { data: existingUser, error: existingUserError } = await supabase.from(tableName).select("id").eq("id", user.id);

	console.log(existingUser);

	if (existingUserError) {
		console.error("Error checking for existing user:", existingUserError);
		return {
			error: existingUserError,
			status: existingUserError.status,
		};
	}
	// If user does not exist, insert them
	if (!existingUser) {
		const retObj = await supabase.from(tableName).insert({
			id: user.id,
			email: user.email,
			name: user.user_metadata.full_name,
			avatar_url: user.user_metadata.avatar_url,
		});

		if (retObj.status === 201) {
			return {
				data: retObj.data,
				status: retObj.status,
			};
		} else {
			return {
				error: retObj.error,
				status: retObj.status,
			};
		}
	}
};

const signOut = async (e) => {
	if (e) e.preventDefault();

	const data = await supabase.auth.signOut();
	return data;
};

export { insertUserData, setUser, signInWithGoogle, signOut };
