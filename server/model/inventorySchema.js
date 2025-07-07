const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  styleID: { type: Number, required: true },
  sku: { type: String, required: true },
  gtin: String,
  skuID_Master: Number,

  warehouseAbbr: String,
  skuID: { type: Number, required: true }, // SKU ID for warehouse (unique per SKU x warehouse)
  qty: Number,
}, { timestamps: true });

module.exports = mongoose.model("inventorySchema", inventorySchema);
