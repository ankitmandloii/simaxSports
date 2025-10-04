const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const SyncServices = require("../services/ssApi.service.js")
const { uploadToShopify } = require("../services/shopify.service.js");
const { mapProducts } = require("../utils/mapper.js");
// const ssProductMapping = require("../model/SSProductMapping.js");
const specSchema = require("../model/specSchema.js");
const inventorySchema = require("../model/inventorySchema.js");
const StyleIdSyncJob = require("../model/StyleIdSyncJob.js");
const uploadBrandSchema = require("../model/uploadBrandSchema.js");
const { default: axios } = require("axios");
const SSProductMapping = require("../model/SSProductMapping.js");
// const { createSmartCollectionForBaseCategory } = require("../scheduler/triggerSync.js")







exports.getAllStyleIdsFromDb = async (req, res) => {
  try {
    const styles = await StyleIdSyncJob.find().lean();

    return sendResponse(res, statusCode.OK, true, "Style IDs fetched", {
      count: styles.length,
      styleIds: styles.map(style => ({
        styleId: style.styleId,
        status: style.status,
        productBrandName: style.productBrandName || "N/A",
        totalProducts: style.totalProducts || 0,
        syncedProducts: style.syncedProducts || 0,
        lastAttemped: style.lastAttemped || null,
        error: style.error || null
      }))
    });

  } catch (error) {
    console.error("[ERROR] getStyleIds:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};


// const markVariantUnavailable = async (sku) => {

//   const product = await SSProductMapping.findOne({ sku: sku });
//   if (!product?.shopifyVariantId) {
//     console.warn(`⚠️ No variant ID for SKU ${skuId}`);
//     return;
//   }

//   try {
//     const mutation = `
//           mutation variantUpdate($input: ProductVariantInput!) {
//             productVariantUpdate(input: $input) {
//               productVariant { id availableForSale }
//               userErrors { field message }
//             }
//           }
//         `;
//     const variables = {
//       input: {
//         id: product.shopifyVariantId,
//         availableForSale: false
//       }
//     };

//     const res = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = res.data?.data?.productVariantUpdate?.userErrors;
//     if (errors?.length) {
//       console.warn(`⚠️ Failed to disable variant SKU ${skuId}:`, errors);
//     } else {
//       console.log(`🟡 Variant marked unavailable: ${skuId}`);
//     }
//   } catch (err) {
//     console.error(`❌ Failed to mark variant ${skuId} unavailable:`, err.message);
//   }
// };

// Rebuild brand docs from remaining styles + remove empty brands
exports.updateUploadBrandSchemaForAfterDeleteWhichStyleIdHasNoData = async () => {
  try {
    // 1) Group remaining styles by brand (dedup in Mongo)
    const grouped = await StyleIdSyncJob.aggregate([
      { $match: { productBrandName: { $ne: null } } },
      {
        $group: {
          _id: "$productBrandName",
          styleIds: { $addToSet: "$_id" },     // ObjectIds of StyleIdSyncJob docs
          styleIdStrings: { $addToSet: "$styleId" }, // string style IDs
          brandImage: { $first: "$brandImage" }
        }
      }
    ]);

    // 2) Upsert/overwrite brand arrays + counts
    const bulkOps = grouped.map(g => ({
      updateOne: {
        filter: { BrandName: g._id },
        update: {
          $set: {
            styleIds: g.styleIds,
            styleIdStrings: g.styleIdStrings,
            totalStyleIds: g.styleIds.length,
            brandImage: g.brandImage || "",
            BrandSyncStatus: "pending",
            pendingStyleIds: [],
            lastAttemptedBrandSync: null,
            error: null
          }
        },
        upsert: true
      }
    }));

    if (bulkOps.length) {
      await uploadBrandSchema.bulkWrite(bulkOps);
      console.log(`✅ Updated ${bulkOps.length} brands in uploadBrandSchema`);
    } else {
      console.log("ℹ️ No brands to upsert (no styles remain).");
    }

    // 3) Remove brand docs that no longer have any styles
    const keepBrandNames = grouped.map(g => g._id);
    const removeRes = await uploadBrandSchema.deleteMany({
      BrandName: { $nin: keepBrandNames }
    });
    if (removeRes.deletedCount) {
      console.log(`🧹 Removed ${removeRes.deletedCount} empty brand doc(s)`);
    }

    return { updated: bulkOps.length, removedEmpty: removeRes.deletedCount || 0 };
  } catch (err) {
    console.error("❌ Error in updateUploadBrandSchema:", err.message);
    throw err;
  }
};


//code for fetch and store only styleID whihch we want from S&S
exports.fetchAndStoreStyleIdsWhichClientWants = async (req, res) => {
  try {
    const matchingStyles = await SyncServices.fetchAllStyleIdsWhihcClientNeedsFromSandS();
    // Step 4: Save only filtered styles to StyleIdSyncJob
    if (matchingStyles.length > 0) {
      const bulkOps = matchingStyles.map(s => ({
        updateOne: {
          filter: { styleId: s.styleId },
          update: {
            $setOnInsert: {
              ...s,
              status: "pending",
              totalProducts: 0,
              syncedProducts: 0,
              lastAttemped: null,
              error: null,
              products: []
            }
          },
          upsert: true
        }
      }));

      await StyleIdSyncJob.bulkWrite(bulkOps);
      console.log(`✅ Saved ${bulkOps.length} filtered styles to StyleIdSyncJob`);
    } else {
      console.warn("⚠️ No matching styles found to save.");
    }




    const todeleteStyleIdWhicHasNoData = await SyncServices.updateUploadBrandSchema();

    return todeleteStyleIdWhicHasNoData;

    // return sendResponse(res, statusCode.OK, true, "Style IDs have been saved to the database", {
    //   totalStyleIds: {}
    // });

  } catch (err) {
    console.error("❌ Error saving style IDs:", err.message);
    // return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, "Failed to save style IDs");
  }
};




exports.deleteShopifyProduct = async (req, res) => {
  try {
    const { shopifyProductId } = req.query;
    console.log(shopifyProductId);
    console.log(`🔍 Deleting Shopify product with ID: ${shopifyProductId}...`);

    // Step 1: GraphQL mutation for deleting a product
    const mutation = `
      mutation productDelete($input: ID!) {
        productDelete(input: { id: $input }) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Step 2: Construct Shopify GID
    const shopifyGID = `gid://shopify/Product/${shopifyProductId}`;

    // Step 3: Perform the mutation request
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
      {
        query: mutation,
        variables: { input: shopifyGID },
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 4: Process response
    const result = response.data?.data?.productDelete;

    if (result?.userErrors?.length) {
      console.error(`❌ Shopify error while deleting product ID ${shopifyProductId}:`, result.userErrors);
      return sendResponse(res, statusCode.BAD_REQUEST, false, "Shopify error while deleting product ID");
    }

    console.log(`🗑️ Successfully deleted from Shopify: ${shopifyProductId} (${result.deletedProductId})`);
    return sendResponse(res, statusCode.OK, true, result);
   
  } catch (err) {
    console.error(`❌ Failed to delete product ID=${shopifyProductId}:`, err.response?.data || err.message);
    return sendResponse(res, statusCode.BAD_REQUEST, false, "Failed to delete product ID");
  }
};

// exports.deleteObsoleteShopifyProducts = async (currentSSStyleIds = []) => {
//   try {
//     console.log(`🔍 Checking for obsolete Shopify products...`);

//     // Step 1: Find products that exist in DB but not in current S&S list
//     const obsoleteProducts = await SSProductMapping.find({
//       styleId: { $nin: currentSSStyleIds },
//       shopifyProductId: { $ne: null },
//     });

//     console.log(`🧹 Found ${obsoleteProducts.length} products to delete.`);

//     // Step 2: GraphQL mutation for deleting a product
//     const mutation = `
//       mutation productDelete($input: ID!) {
//         productDelete(input: { id: $input }) {
//           deletedProductId
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     for (const product of obsoleteProducts) {
//       const shopifyGID = `gid://shopify/Product/${product.shopifyProductId}`;

//       try {
//         const response = await axios.post(
//           `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
//           {
//             query: mutation,
//             variables: { input: shopifyGID },
//           },
//           {
//             headers: {
//               "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const result = response.data?.data?.productDelete;

//         if (result?.userErrors?.length) {
//           console.error(`❌ Shopify error while deleting ${product.styleId}:`, result.userErrors);
//           continue;
//         }

//         console.log(`🗑️ Deleted from Shopify: ${product.styleId} (${result.deletedProductId})`);

//         // Step 3: Remove or mark product in local DB
//         // await SSProductMapping.deleteOne({ _id: product._id });

//         // OR safer:
//         // await SSProductMapping.updateOne(
//         //   { _id: product._id },
//         //   { $set: { deletedFromShopify: true, shopifyProductId: null } }
//         // );

//       } catch (err) {
//         console.error(`❌ Failed to delete styleId=${product.styleId}:`, err.response?.data || err.message);
//       }
//     }

//     console.log("✅ Obsolete product cleanup done.");
//   } catch (err) {
//     console.error("❌ Error during Shopify delete sync:", err.message);
//   }
// };


exports.createSmartCollection = async (brandName, tag, brandImageUrl) => {
  const imageUrl = brandImageUrl
    ? `https://cdn.ssactivewear.com/${brandImageUrl}`
    : "https://default.image.url";

  const collectionTitle = `${brandName}`;

  const collectionData = {
    "smart_collection": {
      "title": collectionTitle,
      "body_html": `<strong>${brandName} collection for 2025</strong>`,
      "published": true,
      "rules": [
        {
          "column": "tag",
          "relation": "equals",
          "condition": tag
        }
      ],
      "image": {
        "src": imageUrl
      }
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
  };

  const apiBaseUrl = `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-07`;

  try {
    // 1. Check if collection already exists by title
    const existingCollectionsRes = await axios.get(
      `${apiBaseUrl}/smart_collections.json?title=${encodeURIComponent(collectionTitle)}`,
      { headers }
    );

    const existingCollection = existingCollectionsRes.data.smart_collections.find(
      col => col.title === collectionTitle
    );

    if (existingCollection) {
      // 2. Update existing collection
      const updateData = {
        smart_collection: {
          id: existingCollection.id,
          body_html: collectionData.smart_collection.body_html,
          rules: collectionData.smart_collection.rules,
          image: collectionData.smart_collection.image
        }
      };

      await axios.put(
        `${apiBaseUrl}/smart_collections/${existingCollection.id}.json`,
        updateData,
        { headers }
      );

      console.log(`Smart collection "${collectionTitle}" updated.`);
    } else {
      // 3. Create new collection
      const response = await axios.post(
        `${apiBaseUrl}/smart_collections.json`,
        collectionData,
        { headers }
      );

      console.log(`Smart collection "${collectionTitle}" created.`);
    }

  } catch (error) {
    if (error.response) {
      console.error('Shopify API error:', error.response.data);
    } else {
      console.error('Request error:', error.message);
    }
  }
};



exports.saveSSProductsToDb = async (req, res) => {
  try {

    const styleIds = [39];
    const ssProducts = await SyncServices.fetchSSProductsByStyleIds(styleIds);
    const result = await SyncServices.saveSSProducts(ssProducts);

    if (result && result.length) {
      return sendResponse(res, statusCode.OK, true, "S&S Products Saved", result);
    } else {
      return sendResponse(res, statusCode.BAD_REQUEST, false, "No data to save");
    }
  } catch (err) {
    console.error("Error saving S&S products:", err);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, "Failed to save products");
  }
};







exports.syncSandsToShopifytest = async (res, req) => {
  try {
    const styleIds = 4500; // single ID

    const ssProducts = await SyncServices.fetchSSProductsByStyleIds(styleIds);
    console.log("length of geted product", ssProducts);

    // const specs = await SyncServices.fetchSSpecsByStyleId(styleIds);
    // console.log("length of specs product", specs.length);

    // const shopifyFormatted = await mapProducts(ssProducts, specs);
    // console.log("length of shopifyFormatted product", shopifyFormatted.length);

    // const uploaded = await uploadToShopify(shopifyFormatted);

    // if (!uploaded || uploaded.length === 0) {
    //   console.error("Nothing was uploaded", uploaded);
    //   return {
    //     success: false,
    //     styleID,
    //     message: "No products synced to Shopify",
    //   };
    // }

    // return {
    //   success: true,
    //   // styleID,
    //   // uploadedCount: uploaded.length,
    // };
    // return sendResponse(res, statusCode.OK, true, "Products fetched successfully", {
    //     count: ssProducts.length,
    //     sample: ssProducts.slice(0,5),
    // });
  } catch (error) {
    console.error("[SYNC ERROR]", error.message);
    // return {
    //   success: false,
    //   styleID,
    //   error: error.message,
    // };
  }
};


// Controller: Sync all products from S&S
exports.syncSandsToShopify = async (req, res) => {


  // console.log("[SYNC] Fetching style IDs...");
  // const styleIds = await fetchAllStyleIds(); //may be it will fetch from DB Id's

  try {
    const styleID = 12614; //for testing purpose TASC Performance Inc
  
    const job = await StyleIdSyncJob.findOne({ styleId: styleID });

    // // Fetch data for the style
    let ssData, specs;

    try {
      const styleID = 12614;
      ssData = await SSProductMapping.find({ styleID });
      console.log(`[S&S] Fetched styleID from db ${styleID} with ${ssData.length} SKUs`);
      if (!ssData || ssData.length === 0) {
        throw new Error('No product data found in DB');
      }
    } catch (err) {
      console.error("Error fetching SS products:", err);
      throw new Error("Failed to fetch SS products");
    }

    try {
      specs = ssData.flatMap(p => p.specs || []);
    } catch (err) {
      console.error("Error fetching SS specs:", err);
      throw new Error("Failed to fetch SS specs");
    }

    // Format the products for Shopify
    const shopifyFormatted = await mapProducts(ssData, specs, job.title, job.description, job.baseCategory);



    const uploaded = await uploadToShopify(shopifyFormatted);


    // await createSmartCollectionForBaseCategory(job.baseCategory, job.baseCategory, job.brandImage);
    if (!uploaded || uploaded.length === 0) {
      console.error("Nothing was uploaded", uploaded);
      return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.NO_PRODUCTS_SYNCED);
    }


    return sendResponse(res, statusCode.OK, true, "Products fetched successfully", uploaded.length);
  } catch (error) {

    console.error("[SYNC ERROR]", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

exports.productDataGetFromSS = async (req, res) => {
  try {

    const { styleId } = req.body; //for testing purpose


    const ssProducts = await SyncServices.fetchSSProductsByStyleIds(styleId);

    return sendResponse(res, statusCode.OK, true, "Products fetched successfully", { "dataLength": ssProducts.length, "data": ssProducts });
  } catch (error) {
    console.error("[SYNC ERROR]", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};


//lenght get of products 
exports.productLenghtGetFromSS = async (req, res) => {
  try {

    const styleIds = req.body.styleId; //for testing purpose

    const ssProductdata = await SyncServices.fetchSingleProductSSByStyleId(styleIds);
    return sendResponse(res, statusCode.OK, true, "Product fetched successfully", {
      count: ssProductdata.length,
      sample: ssProductdata,
    });

  } catch (error) {
    console.error("[Product fetched ERROR]", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

exports.getProductsFromDb = async (req, res) => {
  try {
    // Fetch all product mappings directly from the database
    const allProducts = await SyncServices.getProductsFromDb()


    return sendResponse(res, statusCode.OK, true, "All raw products fetched from DB", {
      count: allProducts.length,
      products: allProducts
    });

  } catch (error) {
    console.error("[ERROR] getProductsFromDb:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

exports.getProductByStyleIdFromDb = async (req, res) => {
  try {
    const { styleId } = req.body;

    if (!styleId) {
      return sendResponse(res, statusCode.BAD_REQUEST, false, "Missing styleId parameter");
    }

    // Fetch products by styleId from the DB
    const products = await SyncServices.getProductsFromDBByStyleId(styleId);

    return sendResponse(res, statusCode.OK, true, `Products for styleId ${styleId} fetched`, {
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("[ERROR] getProductByStyleIdFromDb:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};


//save spec data in db from fetch SS
exports.fetchAndSaveSpecsDataFromSS = async (req, res) => {
  try {
    // const { styleId } = req.params;

    const styleId = 39;
    if (!styleId) {
      return sendResponse(res, statusCode.BAD_REQUEST, false, "styleId is required");
    }

    const specs = await SyncServices.fetchSSpecsByStyleId(styleId);



    const bulkOps = specs.map((spec) => ({
      updateOne: {
        filter: { specID: spec.specID },
        update: { $set: spec },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await specSchema.bulkWrite(bulkOps);
    }



    sendResponse(res, statusCode.OK, true, "Specs fetched from S&S", {
      styleId,
      specs
    });
  } catch (error) {
    console.error("[ERROR] getSpecsFromSandS:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};



//get sepc data from db 
exports.fetchSpecsDataFromDb = async (req, res) => {
  try {
    // Fetch all specs directly from the database
    const allSpecsData = await specSchema.find().lean();

    return sendResponse(res, statusCode.OK, true, "All raw Specs fetched from DB", {
      count: allSpecsData.length,
      specs: allSpecsData
    });

  } catch (error) {
    console.error("[ERROR] getSpecsData from db:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};


//fetch inventory data from SS and save to db 
exports.fetchAndSaveSInventoryFromSS = async (req, res) => {
  try {
    // const { styleId } = req.params;

    const styleId = 12535;
    if (!styleId) {
      return sendResponse(res, statusCode.BAD_REQUEST, false, "styleId is required");
    }

    const inventory = await SyncServices.fetchSSInventoryByStyleId(styleId);

    const flattened = [];
    for (const item of inventory) {
      const base = {
        styleID: item.styleID,
        sku: item.sku,
        gtin: item.gtin,
        skuID_Master: item.skuID_Master
      };

      for (const w of item.warehouses || []) {
        flattened.push({
          ...base,
          warehouseAbbr: w.warehouseAbbr,
          skuID: w.skuID,
          qty: w.qty
        });
      }
    }

    // Prepare bulk operations
    const bulkOps = flattened.map(doc => ({
      updateOne: {
        filter: { skuID: doc.skuID },
        update: { $set: doc },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await inventorySchema.bulkWrite(bulkOps);
    }



    sendResponse(res, statusCode.OK, true, "inventory fetched from S&S", {
      styleId,
      inventory
    });
  } catch (error) {
    console.error("[ERROR] getInventoryFromSandS:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};


//fetch inventory data from db 
exports.fetchInventoryDataFromDb = async (req, res) => {
  try {
    // Fetch  AllInventoryData directly from the database
    const AllInventoryData = await inventorySchema.find().lean();

    return sendResponse(res, statusCode.OK, true, "All raw InventoryData fetched from DB", {
      count: AllInventoryData.length,
      specs: AllInventoryData
    });

  } catch (error) {
    console.error("[ERROR] getInventoryData from db:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};



exports.checkStock = async (req, res) => {
  try {
    const { sku } = req.body;
    // Fetch  AllInventoryData directly from the database
    const inventory = await SyncServices.fetchSSInventoryQTYBySKU(sku);

    return sendResponse(res, statusCode.OK, true, "All raw InventoryData fetched from SS", { inventory });

  } catch (error) {
    console.error("[ERROR] getInventoryData from db:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};




// Function to reset data in the database before syncing new data
exports.resetDatabaseBeforeSync = async (req, res) => {
  try {
    // Step 1: Reset all brands' data
    console.log("🌐 Resetting brand data...");

    await uploadBrandSchema.updateMany(
      {},
      {
        $set: {
          BrandSyncStatus: "pending", // Reset sync status
          error: "",                   // Clear previous errors
          lastAttempedBrandSync: null, // Reset the last sync attempt time
          pendingStyleIds: [],         // Clear pending style IDs
          styleIds: [],
          styleIdStrings: [],                // Clear style IDs
          totalStyleIds: 0,            // Reset total styles count
          brandImage: null             // Reset brand image if necessary
        }
      }
    );

    // Step 2: Reset all styles' data
    console.log("🌐 Resetting style data...");

    await StyleIdSyncJob.updateMany(
      {},
      {
        $set: {
          status: "pending",       // Reset style status to "pending"
          totalProducts: 0,        // Reset product count
          syncedProducts: 0,       // Reset synced products
          lastAttemped: null,      // Reset last sync attempt time
          error: null,             // Clear any previous errors
          products: []             // Clear the product list
        }
      }
    );

    console.log("✅ Reset of database complete. Ready to fetch new data.");

  } catch (err) {
    console.error("❌ Error resetting database:", err.message);
    throw err;
  }
}

