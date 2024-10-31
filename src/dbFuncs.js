
const { Client } = require('pg')


async function connectToDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'student_market_place',
    user: 'postgres',
    password: 'shadow2004'
  });

  await client.connect(); // Connect to the database
  return client; // Return the client instance for further use
};

async function addTrade(itemId, buyerId, sellerId, Initaltimestamp) {

    try{

      const initialTime = new Date(timestamp);
      const expirationDate = new Date(initialTime.getTime() + 72 * 60 * 60 * 1000);
      const query = `INSERT INTO trades (item_id, buyer_id, seller_id, timestamp, expiration_date) 
      VALUES ($1, $2, $3, $4, $5)`;
      const res = await client.query(query, [itemId, buyerId, sellerId, Initaltimestamp, expirationDate]);
      console.log('trade added', res.rows[0].id)
    }
    finally {
      await client.end();
    }
  }
