const mongoose = require('mongoose');
const { Trade } = require('src/schemas.js');
async function addTrade(itemId, proposedItemIds, buyerId, sellerId) {
    try {
      const expirationDate = new Date(Date.now() + 168 * 60 * 60 * 1000);

      const newTrade = new Trade({
        itemId,                    
        proposedItemIds,           
        buyerId,                  
        sellerId,                  
        timestamp: Date.now(),   
        expiration: expirationDate, 
        status: 'pending',        
      });
  

      const savedTrade = await newTrade.save();
      console.log('Trade created:', savedTrade);
    } catch (error) {
      console.error('Error creating trade:', error);
    }
  }