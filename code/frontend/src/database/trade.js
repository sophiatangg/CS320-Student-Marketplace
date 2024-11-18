import { getItemByItemId } from "@database/items";
import { supabase } from "@database/supabaseClient";

const tradeTableName = "Trade";

export const storeTradeInDatabase = async ({ data }) => {
	const res = await supabase.from(tradeTableName).insert(data).select();
	const { data: tradeData } = res;

	if (!tradeData) {
		console.log(res);
		throw Error("Error initiating trade!");
	}

	return tradeData;
};

export const findItemDataFromTrade = async ({ itemId, userId, sellerId }) => {
	if (!itemId || !userId || !sellerId) {
		throw Error("Missing required parameters: itemId, userId, or sellerId");
	}

	try {
		// Query the `Trade` table for matching rows
		const { data: tradeData, error: tradeError } = await supabase
			.from(tradeTableName)
			.select("*")
			.eq("seller_id", sellerId)
			.eq("buyer_id", userId)
			.eq("target_item_id", itemId); // Check if `itemId` exists in the array

		if (tradeError) {
			throw Error("Error fetching trade data.");
		}

		// If no matching trade rows exist, return null
		if (!tradeData || tradeData.length === 0) {
			return null;
		}

		// Fetch the item details from the `Item` table for validation
		const itemData = await getItemByItemId(itemId);

		if (!itemData) {
			throw Error("Error fetching item data.");
		}

		// Return the fetched item details
		return itemData;
	} catch (error) {
		console.error("Error in findItemDataFromTrade:", error);
		throw error;
	}
};
