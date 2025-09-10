const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
  product_id: { type: Number, required: true },
  variant_id: { type: Number, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  inventory_quantity: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  uploadedImage_url: { type: String },
  S3_image_all_urls: [{type: String}]
});

const ProductVariant = mongoose.model('ProductVariantSchema', ProductVariantSchema);

module.exports = ProductVariant;
