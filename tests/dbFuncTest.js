const { Client } = require('pg');
require('dotenv').config();
const { connectToDatabase, addTrade } = require('/Users/sophiatang/CS320-Student-Marketplace/src/dbFuncs.js');
async function testDBFunc(){
    const client = await connectToDatabase(process.env.DB_NAME);
    const sampleTime = '2024-10-30T12:00:00Z';
    const itemId = 'e11eb34d-dee7-4c67-a24a-864a92c32a9e'; 
    const buyerId = '1dd31cf8-38c9-489a-b74f-51b51da15ece'; 
    const sellerId = 'ea0128f6-c881-4715-a7fb-89f6cb4d2662';
    try{
        await addTrade(itemId,buyerId,sellerId,sampleTime,client);
    }catch (error){
        console.error('Error adding trade', error.message)
    }finally {
        client.end(); 
        console.log('Disconnected from the database.');
      }

    }

testDBFunc();