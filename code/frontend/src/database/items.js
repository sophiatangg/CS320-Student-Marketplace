import { supabase } from "@database/supabaseClient";
import { keysChecker } from "@utils/others";

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

export const addItemByUser = async ({ itemData }) => {
	if (!itemData) return null;

	const keysItemData = ["category", "condition", "desc", "name", "surname", "price", "in_trade"];

	if (!keysChecker(keysItemData, itemData)) return;

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userId = user.id;

	const objToAppend = {
		seller_id: userId,
		...itemData,
	};

	const res = await supabase.from(tableName).insert(objToAppend);

	console.log(res);

	return res;
};
