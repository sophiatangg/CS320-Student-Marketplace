import { supabase } from "../../frontend/src/database/supabaseClient.js";

export const storeTradeInDatabase = async (newItem) => {
	try {
		const { data, error } = await supabase.from("Trade").insert([newItem]);
		if (error) {
			console.error("Error adding trade:", error);
			alert(`Error adding trade: ${error.message}`);
		} else {
			console.log("Trade added successfully:", data);
			alert("Trade added successfully!");
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};

//export default storeTradeInDatabase;
