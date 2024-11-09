import * as TradeWindow from ".../.../frontend/popups/TradeWindow.jsx";
import { addTrade, connectToDatabase, disconnectFromDatabase } from "../../backend/dbFuncs.js";

const storeTradeInDatabase = async (req, res, next) => {
	const { itemId, userInitiator, userReceiver, timestamp } = req.body;

	if (!itemId || !userInitiator || !userReceiver || !timestamp) {
		return res.status(400).json({ error: "Missing required trade details" });
	}

	try {
		const client = await connectToDatabase();

		await addTrade(itemId, userInitiator, userReceiver, timestamp, client);
		TradeWindow.handleOfferSubmit(e);

		await disconnectFromDatabase(client);

		res.status(201).json({ message: "Trade successfully stored in database" });
	} catch (err) {
		console.error("Error storing trade in database:", err);
		res.status(500).json({ error: "Failed to store trade in the database" });
	}
};

export default storeTradeInDatabase;
