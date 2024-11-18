import { getItemByItemId, getItemImagesByItemId } from "@database/items";
import { supabase } from "@database/supabaseClient";
import { getUser } from "@database/users";

const tradeTableName = "Trade";

export const fetchTradeRequests = async ({ userId }) => {
	if (!userId) {
		throw new Error("User id is required.");
	}

	try {
		// Query the Trade table for trades where the user is the seller
		const { data: tradeData, error: tradeError } = await supabase.from(tradeTableName).select("*").eq("seller_id", userId);

		if (tradeError) {
			throw new Error("Error fetching trade requests.");
		}

		if (!tradeData || tradeData.length === 0) {
			return []; // No trade requests found
		}

		const fetchData = async (itemId) => {
			const [itemDetails, itemImages] = await Promise.all([getItemByItemId(itemId), getItemImagesByItemId(itemId)]);

			return {
				...itemDetails,
				images: itemImages.map((item) => {
					return item.image_url;
				}),
			};
		};

		// Process each trade to fetch items and trader info
		const tradeRequests = await Promise.all(
			tradeData.map(async (trade) => {
				// Fetch all items offered in the trade
				const tradeOffers = await Promise.all(
					trade.offer_items_ids.map(async (itemId) => {
						return await fetchData(itemId);
					}),
				);

				// Fetch the trader's user info
				const trader = await getUser(trade.buyer_id);

				// Fetch the target item
				const tradeGoal = await fetchData(trade.target_item_id);

				// Return the formatted trade request object
				return {
					trade_offers: tradeOffers,
					trade_goal: tradeGoal,
					trader: trader,
				};
			}),
		);

		return tradeRequests;
	} catch (error) {
		console.error("Error in fetchTradeRequests:", error);
		throw error;
	}
};

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