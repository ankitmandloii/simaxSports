// models/DiscountConfig.js
const mongoose = require("mongoose");

const TierSchema = new mongoose.Schema(
  {
    minQty: { type: Number, required: true, min: 1 },
    rate:   { type: Number, required: true, min: 0, max: 1 } // 0.05 = 5%
  },
  { _id: false }
);

const DiscountConfigSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true, index: true }, // e.g. "global"
    tiers: { type: [TierSchema], required: true, default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscountConfig", DiscountConfigSchema);
