import express from 'express';
import tradeRoute from './middleware/Trade/tradeRoute.js';

const app = express();
app.use(express.json());

app.use(tradeRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});