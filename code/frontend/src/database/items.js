import { supabase } from "@database/supabaseClient";

const tableName = "Item";

export const selectItemsFromUser = async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userId = user.id;

	const res = await supabase.from(tableName).select("id").or(`id.eq.${userId}`);

	if (!res) {
		console.error("Error fetching items from database");
		return {
			data: null,
			error: res.error,
			status: res.status,
		};
	} else {
		return {
			data: res.data,
			error: res.error,
			status: res.status,
		};
	}
};

export const selectAllItems = async () => {
	const res = await supabase.from(tableName).select("*");

	if (!res) {
		console.error("Error fetching items from database");
		return {
			data: null,
			error: res.error,
			status: res.status,
		};
	} else {
		return {
			data: res.data,
			error: res.error,
			status: res.status,
		};
	}
};

export const insertItemByUser = async () => {};
