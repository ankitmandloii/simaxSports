const mongoose = require("mongoose");

const AllBrandsNameSchema = new mongoose.Schema({
    Name: { type: String, required: true },
});


module.exports = mongoose.model("allBrandsNameSchema", AllBrandsNameSchema);

