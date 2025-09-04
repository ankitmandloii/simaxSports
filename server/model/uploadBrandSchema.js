const mongoose = require("mongoose");


const UploadBrandSchema = new mongoose.Schema({
    BrandName: { type: String, required: true },
    styleIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StyleIdSyncJob"
    }],
    styleIdStrings: [{ type: String }],
    brandImage: { type: String },
    BrandSyncStatus: {
        type: String,
        enum: ["success", "pending", "failed"],
        default: "pending"
    },
    totalStyleIds: { type: Number, required: true },
    pendingStyleIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StyleIdSyncJob"
    }],
    lastAttempedBrandSync: { type: Date },
    error: { type: String },
});


module.exports = mongoose.model("uploadBrandSchema", UploadBrandSchema);

