import dbFuncs from '../../backend/dbFuncs.js';

const storeItemInDatabase = async (req, res) => {
  const { itemId, user, category, timestamp } = req.body;

  if (!itemId || !user || !category || !timestamp) {
    return res.status(400).json({ error: "Missing required item details" });
  }

  try {
    await dbFuncs.addItem(itemId, user, category, timestamp);
    res.status(201).json({ message: "Item successfully stored in database" });
  } catch (error) {
    console.error("Error storing item in database:", error);
    res.status(500).json({ error: "Failed to store item in the database" });
  }
};

export default storeItemInDatabase;