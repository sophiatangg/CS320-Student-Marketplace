
const { Client } = require('pg')
const { v4: uuidv4 } = require('uuid');


async function connectToDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'test_database',
    user: 'postgres',
    password: 'shadow2004'
  });

  await client.connect(); // Connect to the database
  console.log('connected')
  return client; // Return the client instance for further use
  
};

async function addTrade(itemId, buyerId, sellerId, initalTimestamp,client) {

      const initialTime = new Date(initalTimestamp);
      const expirationDate = new Date(initialTime.getTime() + 72 * 60 * 60 * 1000);
      const query = `INSERT INTO trades (id,item_id, buyer_id, seller_id, timestamp, expiration_date) 
      VALUES ($1, $2, $3, $4, $5, $6)`;
      const res = await client.query(query, [uuidv4(), itemId, buyerId, sellerId, initalTimestamp, expirationDate]);
      console.log('trade added')

  }

  async function disconnectFromDatabase(client) {
    try {
        await client.end();
        console.log('Disconnected');
    } catch (error) {
        console.error('Error disconnecting from the database:', error);
    }
}

  module.exports = { connectToDatabase , addTrade,disconnectFromDatabase};