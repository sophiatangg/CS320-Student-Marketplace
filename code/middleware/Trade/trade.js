import { supabase } from "../../frontend/src/database/supabaseClient.js";

export const storeTradeInDatabase = async (tradeEntry) => {
	try {
		const { data, error } = await supabase.from("Trade").insert([tradeEntry]);
		if (error) {
			console.error("Error adding trade:", error);
			alert(`Error adding trade: ${error.message}`);
		} else {
			const startTime = data[0].created_at;
			await updateExpiration(data[0].id, startTime);
			console.log("Trade added successfully:", data);
			alert("Trade added successfully!");
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};

export const updateExpiration = async (tradeID, time) => {
	try {
		let initialTime = new Date(time);
		const newExpiration = new Date(initialTime);
		newExpiration.setHours(newExpiration.getHours() + 72);
		const { data, error } = await supabase.from("Trade").update({ expiration_date: newExpiration }).eq("id", tradeID);
		if (error) {
			console.error("Error updating expiration time", error);
			alert(`Error updating expiration time: ${error.message}`);
		} else {
			console.log("Expiration date updated successfully:", data);
			alert("Expiration date updated successfully");
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};

export const updateOffer = async (tradeId, newItemsinTrade, timestamp) => {
	try {
		const { data, error } = await supabase.from("Trade").update({ items_in_trade: newItemsinTrade }).eq("id", tradeId);

		if (error) {
			console.error("Error updating trade items:", updateError);
			alert(`Error updating trade items: ${updateError.message}`);
			return;
		}
		await updateExpiration(tradeId, timestamp);
		console.log("Counter offfer updated successfully:", data);
		alert("Counter offfer updated successfully!");
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};
