const mongoose = require("mongoose");

const specSchema = new mongoose.Schema({
  specID: { type: Number, required: true, unique: true },
  styleID: { type: Number, required: true },
  partNumber: String,
  brandName: String,
  styleName: String,
  sizeName: String,
  sizeOrder: String,
  specName: String,
  value: String
}, { timestamps: true });

module.exports = mongoose.model("specSchema", specSchema);
