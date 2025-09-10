const mongoose = require("mongoose");

const StyleIdSyncJobSchema = new mongoose.Schema({
  styleId: { type: Number, required: true, unique: true },
  styleName: { type: String },      
  title: { type: String },              // ← NEW: S&S Style Name (e.g., "Heavy Cotton Tee")
  description: { type: String },              // ← NEW: S&S Style Name (e.g., "Heavy Cotton Tee")
  partNumber: { type: String },              // ← NEW: S&S Style Name (e.g., "Heavy Cotton Tee")
  baseCategory: { type: String },              // ← NEW: S&S Style Name (e.g., "Heavy Cotton Tee")
  productBrandName: { type: String }, 
  brandImage: { type: String },       // ← Already there
  categories: [{ type: String }],           // ← NEW: category array
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "pending"
  },
  totalProducts: { type: Number },
  syncedProducts: { type: Number },
  lastAttemped: { type: Date },
  error: { type: String },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SSProductMapping"
    }
  ]
});

module.exports = mongoose.model("StyleIdSyncJob", StyleIdSyncJobSchema);

