import { supabase } from "../../frontend/src/database/supabaseClient.js";

export const storeItemInDatabase = async (newItem) => {
	try {
		const { data, error } = await supabase.from("Item").insert([newItem]);
		if (error) {
			console.error("Error adding item:", error);
			alert(`Error adding item: ${error.message}`);
		} else {
			console.log("Item added successfully:", data);
			alert("Item added successfully!");
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};
//export default storeItemInDatabase;
