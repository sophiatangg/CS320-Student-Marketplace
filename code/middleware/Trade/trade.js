import { supabase } from "../../frontend/src/database/supabaseClient.js";

export const updateInTrade = async (itemId) => {
	try {
		const { data, error } = await supabase.from("Item").update({ in_trade: true }).eq("id", itemId);
		if (error) {
			console.error("Error updating item:", error);
			//alert(`Error updating item: ${error.message}`);
		} else {
			console.log("Item updating successfully:", data);
			//alert("Item updating successfully!");
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		//alert("An unexpected error occurred. Please try again later.");
	}
};

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
	for (let i = 0; i < tradeEntry.offer_item_ids.length; i++) {
		updateInTrade(tradeEntry.offer_item_ids[i]);
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
		console.log("Counter offer updated successfully:", data);
		alert("Counter offfer updated successfully!");
	} catch (err) {
		console.error("Unexpected error:", err);
		alert("An unexpected error occurred. Please try again later.");
	}
};

const schedule = require('node-schedule');

async function deleteExpiredTrades() {
  const now = new Date().toISOString(); 
  //first check it's been 48 hours and get all expired trade_ids from Trade_Status
  const { data, error } = await supabase
    .from('trade')
    .select('id')
    .match({ completed: 'FALSE' }) // Only delete uncompleted trades
    .lt('expires_at', now);

  if (error) {
    console.error('Error getting expired trades:', error);
  } 

  if (data.length === 0) {
    console.log('No expired trades found.');
    return;
  }
  
  const expiredTradeIds = data.map((trade) => trade.id);
  console.log('Expired trade IDs:', expiredTradeIds);
  if (expiredTradeIds.length < 0) {
	return;
  }

  //delete trades from Trade table
  const { data: deletedTrades, error: deleteError } = await supabase
    .from('trade')
    .delete()
    .in('id', expiredTradeIds); // Delete trades by their IDs

  if (deleteError) {
    console.error('Error deleting expired trades:', deleteError);
  } else {
    console.log('Expired trades deleted:', deletedTrades);
  }

  //delete trades from Trade_Status table
  const { data: deletedTrade_Status, error: deletedTrade_StatusError } = await supabase
    .from('Trade_Status')
    .delete()
    .in('id', expiredTradeIds); 

  if (deletedTrade_StatusError) {
	console.error('Error deleting expired trades:', deletedTrade_StatusError);
  } else {
	console.log('Expired trades deleted:', deletedTrade_Status);
  }
}

// Schedule the task to run every hour
schedule.scheduleJob('0 * * * *', deleteExpiredTrades);
