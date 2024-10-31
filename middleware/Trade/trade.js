//import {something} from database;
//import express from 'express';

//idk what this is 
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//   });

// const storeTradeInDatabase = async (req, res, next) => {
//     const { itemIds, userInitiator, userReceiver } = req.body;
  
//     if (!itemIds || !userInitiator || !userReceiver) {
//       return res.status(400).json({ error: 'Missing required trade details' });
//     }
  
//     const queryText = `
//       INSERT INTO trade (item_ids, user_initiator, user_receiver, created_at)
//       VALUES ($1, $2, $3, NOW())
//       RETURNING *;
//     `;
  
//     try {
//       const result = await pool.query(queryText, [itemIds, userInitiator, userReceiver]);
  
//       req.tradeData = result.rows[0];
//       next();
//     } catch (err) {
//       console.error('Error storing trade in database:', err);
//       res.status(500).json({ error: 'Failed to store trade in the database' });
//     }
//   };


// const router = express.Router();
// //it's an api route...?
// router.post('/api/trade', storeTradeInDatabase, (req, res) => {
//   res.status(201).json({
//     message: 'Trade successfully stored in database',
//     trade: req.tradeData,
//   });
// });

// export default router;