import { getItemByItemId, getItemImagesByItemId } from "@database/items";
import { supabase } from "@database/supabaseClient";
import { getUser } from "@database/users";

const TRADE_TABLE_NAME = "Trade";
const TRADE_STATUS_TABLE_NAME = "Trade_Status";

export const fetchTradeRequests = async ({ userId, type = "RECEIVED" }) => {
	if (!userId) {
		throw new Error("User ID is required.");
	}

	let queryColumn = null;
	if (type === "RECEIVED") queryColumn = "seller_id";
	if (type === "SENT") queryColumn = "buyer_id";

	try {
		const trader = await getUser(userId);

		let tradeIds = [];
		let tradeQuery;

		// Handle query based on type
		if (type === "COMPLETED") {
			// Fetch trade IDs with status "completed"
			const { data: statusData, error: statusError } = await supabase
				.from(TRADE_STATUS_TABLE_NAME)
				.select("trade_id")
				.eq("status", "completed");

			if (statusError) {
				throw new Error(`Error fetching completed trades: ${statusError.message}`);
			}

			tradeIds = statusData.map((status) => status.trade_id);

			// Use these IDs to fetch trades
			tradeQuery = supabase.from(TRADE_TABLE_NAME).select("*").in("id", tradeIds);
		} else if (type === "REJECTED") {
			// Fetch trade IDs with status "rejected"
			const { data: statusData, error: statusError } = await supabase.from(TRADE_STATUS_TABLE_NAME).select("trade_id").eq("status", "rejected");

			if (statusError) {
				throw new Error(`Error fetching rejected trades: ${statusError.message}`);
			}

			tradeIds = statusData.map((status) => status.trade_id);

			// Use these IDs to fetch trades
			tradeQuery = supabase.from(TRADE_TABLE_NAME).select("*").in("id", tradeIds);
		} else if (queryColumn) {
			// Fetch received or sent trades
			tradeQuery = supabase.from(TRADE_TABLE_NAME).select("*").eq(queryColumn, userId);
		} else {
			throw new Error("Invalid trade request type.");
		}

		const { data: tradeData, error: tradeError } = await tradeQuery;

		if (tradeError) {
			throw new Error(`Error fetching ${type.toLowerCase()} trade requests: ${tradeError.message}`);
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

				const tradeeId = type === "RECEIVED" ? trade.buyer_id : trade.seller_id;
				const tradee = await getUser(tradeeId);

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
					id: trade.id, // Inject the trade's ID
					trade_offers: tradeOffers,
					trade_goal: tradeGoal,
					tradee: tradee,
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

		// Define the status to filter
		let statusFilter = null;
		if (type === "RECEIVED" || type === "SENT") {
			statusFilter = "pending";
		} else if (type === "COMPLETED") {
			statusFilter = "completed";
		} else if (type === "REJECTED") {
			statusFilter = "rejected";
		} else {
			throw new Error("Invalid trade request type.");
		}

		// Fetch trade IDs with the desired status from Trade_Status table
		const { data: statusData, error: statusError } = await supabase.from(TRADE_STATUS_TABLE_NAME).select("trade_id").eq("status", statusFilter);

		if (statusError) {
			throw new Error(`Error fetching trades with status ${statusFilter}: ${statusError.message}`);
		}

		const tradeIds = statusData.map((status) => status.trade_id);

		if (tradeIds.length === 0) {
			return 0; // No trades with the desired status
		}

		// Build the count query based on the type
		if (type === "RECEIVED" || type === "SENT") {
			// For RECEIVED and SENT, filter trades where seller_id or buyer_id equals userId and id in tradeIds
			countQuery = supabase
				.from(TRADE_TABLE_NAME)
				.select("*", {
					count: "exact",
					head: true,
				})
				.eq(queryColumn, userId)
				.in("id", tradeIds);
		} else if (type === "COMPLETED" || type === "REJECTED") {
			// For COMPLETED and REJECTED, include trades where seller_id or buyer_id is userId and id in tradeIds
			countQuery = supabase
				.from(TRADE_TABLE_NAME)
				.select("*", { count: "exact", head: true })
				.or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
				.in("id", tradeIds);
		}

		const { count, error } = await countQuery;

		if (error) {
			throw new Error(`Error fetching ${type.toLowerCase()} trade request count: ${error.message}`);
		}

		return count || 0; // Return the count or 0 if no rows match
	} catch (error) {
		console.error(`Error in fetchTradeRequestCounts (${type}):`, error);
		throw error;
	}
};

export const storeTradeInDatabase = async ({ data }) => {
	const res = await supabase.from(TRADE_TABLE_NAME).insert(data).select();
	const { data: tradeData } = res;

	if (!tradeData) {
		console.log(res);
		throw Error("Error initiating trade!");
	}

	return tradeData;
};

/*
	This is useful to find items from "Trade" table, where items are only pending!
*/
export const findPendingItemDataFromTrade = async ({ itemId, userId, sellerId }) => {
	if (!itemId || !userId || !sellerId) {
		throw new Error("Missing required parameters: itemId, userId, or sellerId");
	}

	try {
		// Query the `Trade` table for matching rows where `status` is "pending"
		const { data: tradeData, error: tradeError } = await supabase
			.from(TRADE_TABLE_NAME)
			.select(`*, ${TRADE_STATUS_TABLE_NAME}(status)`)
			.eq("seller_id", sellerId)
			.eq("buyer_id", userId)
			.eq("target_item_id", itemId)
			.eq(`${TRADE_STATUS_TABLE_NAME}.status`, "pending"); // Ensure the status is "pending"

		if (tradeError) {
			return null;
		}

		// If no matching trade rows exist, return null
		if (!tradeData || tradeData.length === 0) {
			return null;
		}

		// Fetch the item details from the `Item` table for validation
		const itemData = await getItemByItemId(tradeData.target_item_id);

		if (!itemData) {
			return null;
		}

		// Return the fetched item details
		return itemData;
	} catch (error) {
		console.error("Error in findItemDataFromTrade:", error);
		return error;
	}
};

export const findTradeIdByOffersAndTarget = async ({ offer_ids, targetId, userId, type }) => {
	if (!offer_ids || offer_ids.length === 0 || !targetId || !userId || !type) {
		console.error("offer_ids, targetId, userId, and type are required.");
		return { tradeId: -1, error: "Missing input parameters." };
	}

	if (type !== "SENT" && type !== "RECEIVED") {
		console.error("Invalid type. Must be 'SENT' or 'RECEIVED'.");
		return { tradeId: -1, error: "Invalid type parameter." };
	}

	// Determine the user column to filter by based on the type
	const userColumn = type === "SENT" ? "buyer_id" : "seller_id";

	try {
		// Fetch trades matching the user, targetId, and offer_ids
		const { data, error } = await supabase
			.from(TRADE_TABLE_NAME)
			.select("id, offer_items_ids")
			.eq(userColumn, userId)
			.eq("target_item_id", targetId);

		if (error) {
			console.error("Error fetching trade:", error.message);
			return { tradeId: -1, error: error.message };
		}

		if (!data || data.length === 0) {
			return { tradeId: -1, error: null }; // No matching trade found
		}

		// Find the trade where the offer_ids match exactly
		const matchingTrade = data.find((trade) => {
			const tradeOfferIds = trade.offer_items_ids;
			if (!tradeOfferIds || !Array.isArray(tradeOfferIds)) return false;

			// Check if tradeOfferIds contains exactly the same IDs as offer_ids
			const isMatch = tradeOfferIds.length === offer_ids.length && offer_ids.every((offerId) => tradeOfferIds.includes(offerId));

			return isMatch;
		});

		return matchingTrade ? { tradeId: matchingTrade.id, error: null } : { tradeId: -1, error: null };
	} catch (err) {
		console.error("Unexpected error fetching trade:", err);
		return { tradeId: -1, error: err.message };
	}
};

export const removeTradeById = async ({ id }) => {
	if (!id) {
		console.error("Trade ID is required for deletion.");
		return {
			deletedRow: null,
			error: "Trade ID is missing.",
		};
	}

	try {
		// Delete the row with the given ID from the Trade table
		const { data: deletedRow, error } = await supabase
			.from(TRADE_TABLE_NAME)
			.delete()
			.eq("id", id)
			.select("*") // Fetch the deleted row
			.single();

		if (error) {
			console.error("Error deleting trade:", error.message);
			return {
				deletedRow: null,
				error,
			};
		}

		return {
			deletedRow,
			error: null,
		};
	} catch (err) {
		console.error("Unexpected error deleting trade:", err);
		return {
			deletedRow: null,
			error: err,
		};
	}
};

export const updateTradeByColumn = async ({ id, column, value }) => {
	if (!id || !column) {
		console.error("ID and column name are required for updating a trade.");
		return false;
	}

	try {
		const { error } = await supabase
			.from(TRADE_TABLE_NAME)
			.update({ [column]: value }) // Use dynamic key for the column
			.eq("id", id);

		if (error) {
			console.error("Error updating column:", error.message);
			return false;
		}

		return true;
	} catch (err) {
		console.error("Unexpected error updating column:", err);
		return false;
	}
};

export const initializeTradeStatus = async ({ tradeId }) => {
	if (!tradeId) {
		console.error("Trade ID is required to initialize trade status.");
		return { data: null, error: "Trade ID is missing." };
	}

	try {
		const { data, error } = await supabase.from(TRADE_STATUS_TABLE_NAME).insert({ trade_id: tradeId, status: "pending" }).select().single();

		if (error) {
			console.error("Error initializing trade status:", error);
			return { data: null, error };
		}

		return { data, error: null };
	} catch (err) {
		console.error("Unexpected error initializing trade status:", err);
		return { data: null, error: err };
	}
};

export const fetchTradeStatus = async ({ tradeId }) => {
	if (!tradeId) {
		console.error("Trade ID is required to fetch trade status.");
		return { data: null, error: "Missing trade ID." };
	}

	try {
		const { data, error } = await supabase.from(TRADE_STATUS_TABLE_NAME).select("*").eq("trade_id", tradeId).single();

		if (error) {
			console.error("Error fetching trade status:", error);
			return { data: null, error };
		}

		return { data, error: null };
	} catch (err) {
		console.error("Unexpected error fetching trade status:", err);
		return { data: null, error: err };
	}
};

export const updateTradeStatus = async ({ tradeId, status }) => {
	if (!tradeId) {
		console.error("Trade ID is required to update trade status.");
		return { data: null, error: "Missing trade ID." };
	}

	const validStatuses = ["pending", "rejected", "completed"];
	if (!validStatuses.includes(status)) {
		console.error(`Invalid status: "${status}". Valid statuses are: ${validStatuses.join(", ")}.`);
		return { data: null, error: `Invalid status: "${status}".` };
	}

	try {
		const { data, error } = await supabase
			.from(TRADE_STATUS_TABLE_NAME)
			.update({
				status: status,
				date_edited: new Date().toISOString(),
			})
			.eq("trade_id", tradeId)
			.select()
			.single();

		if (error) {
			console.error("Error updating trade status:", error);
			return { data: null, error };
		}

		return { data, error: null };
	} catch (err) {
		console.error("Unexpected error updating trade status:", err);
		return { data: null, error: err };
	}
};
