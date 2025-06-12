const mongoose = require("mongoose");
const ActiveUser = require('../model/activeUserSchema'); // adjust path




let isConnected = false;

exports.dbConnection = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.DB_URL);

        isConnected = true;
        console.log("--- Connected to Mongoose Successfully ---");

        //TTL is set to 5 minutes (300s), only users active in the last 5 minutes will be retained,
        const indexes = await ActiveUser.collection.indexes();
        const hasTTL = indexes.some(index => index.expireAfterSeconds === 300);
        if (!hasTTL) {
            await ActiveUser.collection.createIndex(
                { lastActive: 1 },
                { expireAfterSeconds: 300 }
            );
            console.log("TTL index created on 'lastActive'");
        }

    } catch (error) {
        console.error("Mongoose connection error:", error);
        throw error;
    }
};


