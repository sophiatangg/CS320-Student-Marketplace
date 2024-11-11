import dbFuncs from '../../backend/dbFuncs.js';

const storeTradeInDatabase = async (req, res) => {
  const { itemId, buyerId, sellerId, timestamp } = req.body;

  if (!itemId || !buyerId || !sellerId || !timestamp) {
    return res.status(400).json({ error: "Missing trade details" });
  }

  try {
    await dbFuncs.addTrade(itemId, buyerId, sellerId, timestamp);
    res.status(201).json({ message: "Trade successfully recorded" });
  } catch (error) {
    console.error("Error recording trade:", error);
    res.status(500).json({ error: "Failed to record trade" });
  }
};

export default storeTradeInDatabase;