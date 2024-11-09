import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

async function connectToDatabase() {
	const client = new Client({
		host: "localhost",
		port: 5433,
		database: "test_database",
		user: "postgres",
		password: "shadow2004",
	});

	await client.connect(); // Connect to the database
	console.log("connected");
	return client; // Return the client instance for further use
}

async function addItem(itemId, sellerId, category, initalTimestamp) {
	const initialTime = new Date(initalTimestamp);
	const query = 'INSERT INTO ITEM (id, seller_id, created_at, category) VALUES ($1, $2, $3, $4)';
	const res = await client.query(query, [uuidv4(), itemID, sellerId, category, initalTimestamp]);
	console.log("item created");
}

async function addTrade(itemId, buyerId, sellerId, initalTimestamp, client) {
	const initialTime = new Date(initalTimestamp);
	const expirationDate = new Date(initialTime.getTime() + 72 * 60 * 60 * 1000);
	const query = `INSERT INTO trade (id,item_id, buyer_id, seller_id, timestamp, expiration_date) 
      VALUES ($1, $2, $3, $4, $5, $6)`;
	const res = await client.query(query, [uuidv4(), itemId, buyerId, sellerId, initalTimestamp, expirationDate]);
	console.log("trade added");
}

async function disconnectFromDatabase(client) {
	try {
		await client.end();
		console.log("Disconnected");
	} catch (error) {
		console.error("Error disconnecting from the database:", error);
	}
}

export default { connectToDatabase, addTrade, disconnectFromDatabase };
