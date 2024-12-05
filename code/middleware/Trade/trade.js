import { supabase } from "../../frontend/src/database/supabaseClient.js";

export const storeTradeInDatabase = async (newItem) => {
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

export const updateOffer = async (tradeId, ItemsinTrade, item) => {
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
export const acceptOffer = async (tradeId) => {
	try {
		// updating the trade to completed in trade table 
		const { data:tradeData, error:tradeError } = await supabase.from("Trade").update({ completed: true }).eq("id", tradeId);
		if (tradeError) {
            console.error("Error completing the trade:", tradeError);
            alert(`Error completing the trade: ${tradeError.message}`);
            return;
        }

		// accessing the item id of the wanted item in the trade
		const { data: itemWantedData, error: itemWantedError } = await supabase.from("Trade").select("target_item_id").eq("id", tradeId).single();
		if (itemWantedError) {
            console.error("Error selecting item wanted data:", itemWantedError);
            alert(`Error completing the trade: ${itemWantedError.message}`);
            return;
        }
		
		const itemWantedID = itemWantedData.target_item_id;


		// accessing the item id of the offered items in the trade
		const { data: offeredItemData, error: offeredItemError } = await supabase.from("Trade").select("offer_items_ids").eq("id", tradeId).single();
		if (offeredItemError) {
            console.error("Error selecting offered items data:", offeredItemError);
            alert(`Error completing the trade: ${offeredItemError.message}`);
            return;
        }
		

		const offeredItemIDs = offeredItemData.offer_items_ids;

		// updating the wanted item to unavailable in the items table
		const {error: wantedItemUpdateError} = await supabase.from("Item").update({ available: false }).eq("id", itemWantedID);

		if (wantedItemUpdateError) {
            console.error("Error update availability of wanted item:", wantedItemUpdateError);
            alert(`Error completing the trade: ${wantedItemUpdateError.message}`);
            return;
        }
		// updating the offered items to unavailable in the items table
		const {error: offeredItemsUpdateError } = await supabase.from("Item").update({ available: false }).in("id", offeredItemIDs);
		if (offeredItemsUpdateError) {
            console.error("Error update availability of offered items:", offeredItemsUpdateError);
            alert(`Error completing the trade: ${offeredItemsUpdateError.message}`);
            return;
        }
		

		console.log("trade successfully accepted:", tradeData);
		alert("trade successfully accepted");
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};

