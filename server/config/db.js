const mongoose = require("mongoose");

exports.dbConnection = async () => {
    mongoose.connect(`mongodb+srv://ankitprajapat:0fWMgJGKmoAsdhDq@cluster1.figh24a.mongodb.net/testingHospitalManagement`)
        .then((res) => {
            console.log("--- Connected to Mongoose Successfully ---");
        })
        .catch((error) => {
            console.log(error, "--- Mongoose Can't Connect ---");
        });
};

