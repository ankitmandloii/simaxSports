const mongoose = require("mongoose");

// const ssProductMappingSchema = new mongoose.Schema({
//   styleID: { type: Number, required: true },
//   ssProductSku: { type: String, required: true }, // "B00760033"
//   ssProductQty: { type: Number, required: true }, // total qty (sum of warehouses)
//   ssProductData: { type: Object, required: true },

//   warehouses: { type: [Object], default: [] }, // ✅ Add this

//   shopifyProductId: { type: String, default: null },
//   shopifyProductData: { type: Object, default: null },
//   shopifyVariantId: { type: String, default: null },
//   shopifyInventoryId: { type: String, default: null },
//   shopifyInventoryStatus: { type: String, default: "not_synced" },
//   shopifyDataUpdateStatus: { type: String, default: "pending" },
// }, { timestamps: true });

const ssProductMappingSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  gtin: String,
  skuID_Master: Number,
  yourSku: String,
  styleID: { type: Number, required: true },
  brandName: String,
  brandID: String,
  styleName: String,
  colorName: String,
  colorCode: String,
  colorPriceCodeName: String,
  colorGroup: String,
  colorGroupName: String,
  colorFamilyID: String,
  colorFamily: String,
  baseCategoryID: String,
  colorSwatchImage: String,
  colorSwatchTextColor: String,
  colorFrontImage: String,
  colorSideImage: String,
  colorBackImage: String,
  colorDirectSideImage: String,
  colorOnModelFrontImage: String,
  colorOnModelSideImage: String,
  colorOnModelBackImage: String,
  color1: String,
  color2: String,
  sizeName: String,
  sizeCode: String,
  sizeOrder: String,
  sizePriceCodeName: String,
  caseQty: Number,
  unitWeight: Number,
  mapPrice: Number,
  piecePrice: Number,
  dozenPrice: Number,
  casePrice: Number,
  salePrice: Number,
  customerPrice: Number,
  saleExpiration: Date,
  noeRetailing: Boolean,
  caseWeight: Number,
  caseWidth: Number,
  caseLength: Number,
  caseHeight: Number,
  polyPackQty: Number,
  qty: Number,
  countryOfOrigin: String,
  warehouses: { type: [Object], default: [] },

  shopifyProductId: { type: String, default: null },
  shopifyProductData: { type: Object, default: null },
  shopifyVariantId: { type: String, default: null },
  shopifyInventoryId: { type: String, default: null },
  shopifyInventoryStatus: { type: String, default: "not_synced" },
  shopifyDataUpdateStatus: { type: String, default: "pending" },
}, { timestamps: true });


module.exports = mongoose.model("ssProductMapping", ssProductMappingSchema);
// Stores each individual SKU (color/size combination) under a style ID.