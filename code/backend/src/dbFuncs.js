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
// i think maybe we cut all the above
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'tempsupabaseURL';
// const supabaseKey = process.env.SUPABASE_KEY || 'tempAPIkeynolooking';
// const supabase = createClient(supabaseUrl, supabaseKey);

async function addItem(itemId, sellerId, category, initalTimestamp) {
	const initialTime = new Date(initalTimestamp);
	const query = "INSERT INTO item (id, seller_id, created_at, category) VALUES ($1, $2, $3, $4)";
	const res = await client.query(query, [itemID, sellerId, category, initalTimestamp]);
	console.log("item created");
	//cut everything above
	// const { data, error } = await supabase
	// .from('ITEM')
	// .insert([{ id: itemId, seller_id: sellerId, created_at: initialTimestamp, category }]);

	// if (error) {
	// 	console.error('Error adding item:', error);
	// 	throw error;
	// }
	// console.log('Item added:', data);
}

async function addTrade(itemId, buyerId, sellerId, initalTimestamp, client) {
	const initialTime = new Date(initalTimestamp);
	const expirationDate = new Date(initialTime.getTime() + 72 * 60 * 60 * 1000);
	const query = `INSERT INTO trade (id,item_id, buyer_id, seller_id, timestamp, expiration_date) 
      VALUES ($1, $2, $3, $4, $5, $6)`;
	const res = await client.query(query, [uuidv4(), itemId, buyerId, sellerId, initalTimestamp, expirationDate]);
	console.log("trade added");
	// const { data, error } = await supabase
	// .from('trade')
	// .insert([{ id: uuidv4(), item_id: itemId, buyer_id: buyerId, seller_id: sellerId, timestamp: initialTimestamp, expiration_date: expirationDate }]);

	// if (error) {
	// 	console.error('Error adding trade:', error);
	// 	throw error;
	// }
	// console.log('Trade added:', data);
}

//i think we can cut below
async function disconnectFromDatabase(client) {
	try {
		await client.end();
		console.log("Disconnected");
	} catch (error) {
		console.error("Error disconnecting from the database:", error);
	}
}

export default { connectToDatabase, addItem, addTrade, disconnectFromDatabase };
