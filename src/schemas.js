//A schema in MongoDB defines the structure of documents in a collection, including the data types and keys of the dataconst mongoose = require('mongoose');

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
mongoose.connect('mongodb://localhost:27017/StudentMarketPlaceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Define User Schema
  const userSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4 },
    username: String,
    email: String,
    profileId: String,
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  });
  
  // Define Listing Schema
  const listingSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4 },
    title: String,
    description: String,
    price: Number,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'available' }
  });
  
  // Define Trade Schema
  const tradeSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4 },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    proposedItemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' },
    expirationDate: Date
  });
  
  // Create Models
  const User = mongoose.model('User', userSchema);
  const Listing = mongoose.model('Listing', listingSchema);
  const Trade = mongoose.model('Trade', tradeSchema);
  

  module.exports = { User, Listing, Trade };