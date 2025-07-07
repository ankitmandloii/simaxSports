const mongoose = require("mongoose");

const styleIdSchema = new mongoose.Schema({
  styleId: { type: Number, required: true, unique: true },
  productName: { type: String },         // "Gildan 2000"
  productCategory: { type: String },     // "T-Shirts" or from `baseCategoryID` map
  productDescription: { type: String },  // Optional if you can get this later
  status: { type: String, default: "pending" }
});


module.exports = mongoose.model("StyleId", styleIdSchema);
// Purpose: One entry per product family (style), stores general product metadata.