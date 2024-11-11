import express from "express";
import itemRoute from "./middleware/Item/itemRoute.js";

const app = express();
app.use(express.json());

app.use(itemRoute);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
