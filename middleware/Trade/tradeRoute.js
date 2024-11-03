import express from 'express';
import storeTradeInDatabase from './trade.js';

const router = express.Router();

router.post('/api/trade', storeTradeInDatabase);

export default router;