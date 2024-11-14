import { supabase } from "@database/supabaseClient";

const tableName = "Item";

export const selectItemsFromUser = async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userId = user.id;

	const res = await supabase.from(tableName).select("id").or(`id.eq.${userId}`);

	console.log(res);
};
