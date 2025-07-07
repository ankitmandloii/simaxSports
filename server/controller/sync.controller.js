const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const SyncServices =  require("../services/ssApi.service.js")
const { uploadToShopify } = require("../services/shopify.service.js");
const { mapProducts } = require("../utils/mapper.js");
const StyleId = require("../model/Style.js");
const ssProductMapping = require("../model/SSProductMapping.js");
const specSchema = require("../model/specSchema.js");
const inventorySchema = require("../model/inventorySchema.js");






// Controller: Get all style IDs from DB
// exports.getStyleIdsFromDb = async (req, res) => {
//     try {
//         const styleIds = await SyncServices.fetchAllStyleIdsFromDB();
//         return sendResponse(res, statusCode.OK, true, "Style IDs fetched", {
//             count: styleIds.length,
//             styleIds: styleIds, // Show preview
//         });
//     } catch (error) {
//         console.error("[ERROR] getStyleIds:", error.message);
//         return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
//     }
// };old
exports.getAllStyleIdsFromDb = async (req, res) => {
  try {
    const styles = await StyleId.find().lean();

    return sendResponse(res, statusCode.OK, true, "Style IDs fetched", {
      count: styles.length,
      styleIds: styles.map(style => ({
        styleId: style.styleId,
        productName: style.productName || "N/A",
        productCategory: style.productCategory || "N/A",
        productDescription: style.productDescription || "N/A",
        status: style.status
      }))
    });

  } catch (error) {
    console.error("[ERROR] getStyleIds:", error.message);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
  }
};


//save all the style Id in DB 
exports.saveStyleIdsToDb = async (req, res) => {
    try {
        const styleIdsRes = await SyncServices.fetchAllStyleIdsFromSandS();

        const ids = styleIdsRes;

        const bulkOps = ids.map((sid) => ({
            updateOne: {
                filter: { styleId: sid },
                update: { $setOnInsert: { styleId: sid, status: "pending" } },
                upsert: true,
            },
        }));

        await StyleId.bulkWrite(bulkOps);
        return sendResponse(res, statusCode.OK, true, "Style IDs has been saved In DB", { totalStyleIds: ids.length });


    } catch (err) {
        console.error("Error saving style IDs:", err);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, "Failed to save style IDs");

    }
};





// exports.saveSSProducts = async (styleIds) => {
// exports.saveSSProductsToDb = async (req, res) => {
// try {
//    const styleIds =  [39]; //will be remove
//   const ssProducts = await SyncServices.fetchSSProductsByStyleIds(styleIds);

//   const bulkOps = [];

//    for (const product of ssProducts) {
//     const sku = product.sku; // ✅ this is the actual SKU used in Shopify
//     const totalQty = product.warehouses?.reduce((sum, w) => sum + w.qty, 0) || 0;

//     const doc = {
//       styleID: product.styleID,
//       ssProductSku: sku, // ✅ updated field name
//       ssProductQty: totalQty, // ✅ total quantity
//       ssProductData: product,
//       warehouses: product.warehouses || [], // ✅ storing warehouse info

//       shopifyProductId: null,
//       shopifyProductData: null,
//       shopifyVariantId: null,
//       shopifyInventoryId: null,
//       shopifyInventoryStatus: "not_synced",
//       shopifyDataUpdateStatus: "pending",
//     };

//     bulkOps.push({
//       updateOne: {
//         filter: { styleID: product.styleID, ssProductSku: sku },
//         update: { $set: doc },
//         upsert: true,
//       },
//     });
//   }

//   if (bulkOps.length) {
//     await ssProductMapping.bulkWrite(bulkOps);
//      return sendResponse(res, statusCode.OK, true, "Products has been saved In DB", { totalData: bulkOps.length });
//   } else {
//     console.log("No products to save");
//     return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, "No products to save");
//   }

//    } catch (err) {
//         console.error("Error saving Products:", err);
//         return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, "Failed to save Products");

//     }
// };old


exports.saveSSProductsToDb = async (req, res) => {
  try {
    const styleIds = [39]; // Replace with actual style IDs
    const ssProducts = await SyncServices.fetchSSProductsByStyleIds(styleIds);

    const bulkOps = [];

    for (const product of ssProducts) {
      const doc = {
        ...product,
        warehouses: product.warehouses || [],
        shopifyProductId: null,
        shopifyProductData: null,
        shopifyVariantId: null,
        shopifyInventoryId: null,
        shopifyInventoryStatus: "not_synced",
        shopifyDataUpdateStatus: "pending",
      };

      bulkOps.push({
        updateOne: {
          filter: { sku: product.sku, styleID: product.styleID },
          update: { $set: doc },
          upsert: true
        }
      });
    }

    if (bulkOps.length) {
      await ssProductMapping.bulkWrite(bulkOps);
      return sendResponse(res, statusCode.OK, true, "S&S Products Saved", { count: bulkOps.length });
    } else {
      return sendResponse(res, statusCode.BAD_REQUEST, false, "No data to save");
    }

  } catch (err) {
    console.error("Error saving S&S products:", err);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, "Failed to save products");
  }
};


// Controller: Sync all products from S&S
exports.syncProducts = async (req, res) => {
    try {
        // console.log("[SYNC] Fetching style IDs...");
        // const styleIds = await fetchAllStyleIds(); //may be it will fetch from DB Id's
        // const styleIds =  [39]; //for testing purpose


        // const ssProducts = await SyncServices.fetchSSProductsByStyleIds(styleIds);
        
            const allProducts = await SyncServices.getProductsFromDb()
            
           
        //save in DB the ssProducts


        const shopifyFormatted = await mapProducts(allProducts.slice(0,100));
       

        const uploaded = await uploadToShopify(shopifyFormatted);

        console.log(`[API] Upload complete: ${uploaded.length} products synced to Shopify.`);






        if (!uploaded || uploaded.length === 0) {
            console.error("Nothing was uploaded", uploaded);
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.NO_PRODUCTS_SYNCED);
        }


        // return sendResponse(res, statusCode.OK, true, "Products fetched successfully", {
        //     count: ssProducts.length,
        //     sample: ssProducts.slice(0,5),
        // });



        return sendResponse(res, statusCode.OK, true, "Products fetched successfully", shopifyFormatted);
    } catch (error) {
        console.error("[SYNC ERROR]", error.message);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, error.message);
    }
};

exports.productDataGetFromSS = async (req, res) => {
    try {
        // console.log("[SYNC] Fetching style IDs...");
        // const styleIds = await fetchAllStyleIds(); //may be it will fetch from DB Id's
        const styleIds =  [39]; //for testing purpose


        const ssProducts = await SyncServices.fetchSSProductsByStyleIds(styleIds);
        
            // const allProducts = await SyncServices.getProductsFromDb()
            
           
        //save in DB the ssProducts


        // const shopifyFormatted = await mapProducts(allProducts.slice(0, 50));


        // const uploaded = await uploadToShopify(shopifyFormatted);

        // console.log(`[API] Upload complete: ${uploaded.length} products synced to Shopify.`);






        // if (!uploaded || uploaded.length === 0) {
        //     console.error("Nothing was uploaded", uploaded);
        //     return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.NO_PRODUCTS_SYNCED);
        // }


        // return sendResponse(res, statusCode.OK, true, "Products fetched successfully", {
        //     count: ssProducts.length,
        //     sample: ssProducts.slice(0,5),
        // });



        return sendResponse(res, statusCode.OK, true, "Products fetched successfully", ssProducts);
    } catch (error) {
        console.error("[SYNC ERROR]", error.message);
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

//save spec data in db from fetch SS
exports.fetchAndSaveSpecsDataFromSS = async (req, res) => {
  try {
    // const { styleId } = req.params;

    const styleId  = 39;
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
exports.fetchAndSaveSInventoryFromSS = async (req,res) => {
 try {
    // const { styleId } = req.params;

    const styleId  = 39;
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
exports.fetchInventoryDataFromDb  = async (req, res) => {
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