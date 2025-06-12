const mongoose = require("mongoose");
const ActiveUser = require('../model/activeUserSchema'); // adjust path


exports.dbConnection = async () => {
    mongoose.connect(`${process.env.DB_URL}`)
        .then((res) => {
            console.log("--- Connected to Mongoose Successfully ---");
        })
        .catch((error) => {
            console.log(error, "--- Mongoose Can't Connect ---");
        });



    mongoose.connection.once('open', async () => {
        try {
            await ActiveUser.collection.createIndex(
                { lastActive: 1 },
                { expireAfterSeconds: 300 }
            );
            console.log("TTL index created on 'lastActive'");
        } catch (err) {
            console.error("Error creating TTL index:", err);
        }
    });

};




