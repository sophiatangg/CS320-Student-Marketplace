import { supabase } from "../../frontend/src/database/supabaseClient.js";

export const deleteItemInDatabase = async (oldItemId) => {
	try {
		const { data, error } = await supabase.from("Item").delete().eq("id", oldItemId);
		if (error) {
			console.error("Error deleting item:", error);
			alert(`Error deleting item: ${error.message}`);
		} else {
			console.log("Item deleted successfully:", data);
			alert("Item deleted successfully!");
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};
