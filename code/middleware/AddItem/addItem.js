import * as AddNewItemWindow from ".../.../frontend/popups/AddNewItemWindow.jsx";
import { connectToDatabase, disconnectFromDatabase } from "../../backend/dbFuncs.js";

const storeItemInDatabase = async (req, res, next) => {
	const { itemId, user, category, timestamp } = req.body;

	if (!itemId || !user || !category || !timestamp) {
		return res.status(400).json({ error: "Missing required item details" });
	}

	try {
		const client = await connectToDatabase();

		await addItem(itemId, user, category, timestamp, client);
		AddNewItemWindow.handleSubmit(e);

		await disconnectFromDatabase(client);

		res.status(201).json({ message: "Item successfully stored in database" });
	} catch (err) {
		console.error("Error storing item in database:", err);
		res.status(500).json({ error: "Failed to store item in the database" });
	}
};

export default storeItemInDatabase;