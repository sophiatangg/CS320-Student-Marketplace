import express from "express";

const router = express.Router();

router.post("/api/addItem", storeItemInDatabase);

export default router;
