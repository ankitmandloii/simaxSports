const mongoose = require("mongoose");

const deletedSyncRecords = new mongoose.Schema({
  styleId: Number,
  skus: [String],
  shopifyProductId: String,
  deletedAt: Date,
  reason: String
}, { timestamps: true });

module.exports.deletedSyncRecords = mongoose.model("deletedSyncRecords", deletedSyncRecords);
