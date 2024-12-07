import { getItemByItemId, getItemImagesByItemId } from "@database/items";
import { supabase } from "@database/supabaseClient";
import { getUser } from "@database/users";

const tradeTableName = "Trade";

export const fetchTradeRequests = async ({ userId, type = "RECEIVED" }) => {
	if (!userId) {
		throw new Error("User ID is required.");
	}

	let queryColumn = null;
	if (type === "RECEIVED") queryColumn = "seller_id";
	if (type === "SENT") queryColumn = "buyer_id";

	try {
		let tradeQuery;

		// Handle query based on type
		if (type === "COMPLETED") {
			tradeQuery = supabase.from(tradeTableName).select("*").eq("completed", true);
		} else if (queryColumn) {
			tradeQuery = supabase.from(tradeTableName).select("*").eq(queryColumn, userId);
		} else {
			throw new Error("Invalid trade request type.");
		}

		const { data: tradeData, error: tradeError } = await tradeQuery;

		if (tradeError) {
			throw new Error(`Error fetching ${type.toLowerCase()} trade requests.`);
		}

		if (!tradeData || tradeData.length === 0) {
			return []; // No trade requests found
		}

		const fetchData = async (itemId) => {
			try {
				const itemDetails = await getItemByItemId(itemId);
				const itemImages = await getItemImagesByItemId(itemId);

				if (!itemDetails || itemDetails.hasOwnProperty("code")) {
					return {
						id: itemId,
						name: "Unavailable Item",
						images: [],
						isDataUnavailable: true,
					};
				}

				return {
					...itemDetails,
					images: itemImages?.map((img) => img.image_url) || [],
					isDataUnavailable: false,
				};
			} catch (error) {
				return {
					id: itemId,
					name: "Unavailable Item",
					images: [],
					isDataUnavailable: true,
				};
			}
		};

		// Process each trade to fetch items and user info
		const resData = await Promise.all(
			tradeData.map(async (trade) => {
				const tradeOffers = await Promise.all(
					trade.offer_items_ids.map(async (itemId) => {
						try {
							return await fetchData(itemId);
						} catch (error) {}
					}),
				);

				const traderId = type === "RECEIVED" ? trade.buyer_id : trade.seller_id;
				const trader = await getUser(traderId);

				const tradeGoal = await fetchData(trade.target_item_id);

				tradeOffers.forEach((trade) => {
					trade["types"] = {
						kind: "offer",
						result: type,
					};
				});

				tradeGoal["types"] = {
					kind: "goal",
					result: type,
				};

				return {
					trade_offers: tradeOffers,
					trade_goal: tradeGoal,
					trader: trader,
				};
			}),
		);

		return resData;
	} catch (error) {
		console.error(`Error in fetchTradeRequests (${type}):`, error);
		throw error;
	}
};

export const fetchTradeRequestCounts = async ({ userId, type = "RECEIVED" }) => {
	if (!userId) {
		throw new Error("User ID is required.");
	}

	let queryColumn = null;
	if (type === "RECEIVED") queryColumn = "seller_id";
	if (type === "SENT") queryColumn = "buyer_id";

	try {
		let countQuery;

		// Handle count query based on type
		if (type === "COMPLETED") {
			countQuery = supabase.from(tradeTableName).select("*", { count: "exact", head: true }).eq("completed", true);
		} else if (queryColumn) {
			countQuery = supabase.from(tradeTableName).select("*", { count: "exact", head: true }).eq(queryColumn, userId);
		} else {
			throw new Error("Invalid trade request type.");
		}

		const { count, error } = await countQuery;

		if (error) {
			throw new Error(`Error fetching ${type.toLowerCase()} trade request count.`);
		}

		return count || 0; // Return the count or 0 if no rows match
	} catch (error) {
		console.error(`Error in fetchTradeRequestCounts (${type}):`, error);
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
