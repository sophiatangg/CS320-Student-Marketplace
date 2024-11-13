import express from "express";
import storeItemInDatabase from "Item/addItem.js";
import storeTradeInDatabase from "Trade/trade.js";

const router = express.Router();
router.post("/addItem", storeItemInDatabase);
router.post("/trade", storeTradeInDatabase);

export default router;
