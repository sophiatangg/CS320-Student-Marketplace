import { supabase } from "../../frontend/src/database/supabaseClient.js";

export const editItemInDatabase = async (Item) => {
	try {
		const { data, error } = await supabase.from("Item").update([Item]);
		if (error) {
			console.error("Error editing item:", error);
			alert(`Error editing item: ${error.message}`);
		} else {
			console.log("Item edited successfully:", data);
			alert("Item edited successfully!");
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};
