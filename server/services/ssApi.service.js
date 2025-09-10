const axios = require("axios");
const StyleIdSyncJobSchema = require("../model/StyleIdSyncJob");
const specSchema = require("../model/specSchema");
const SSProductMapping = require("../model/SSProductMapping");
const uploadBrandSchema = require("../model/uploadBrandSchema");
const allBrandsNameSchema = require("../model/allBrandsNameSchema");
const StyleIdSyncJob = require("../model/StyleIdSyncJob");
const { deletedSyncRecords } = require("../model/deletedSyncRecords");




const getAuthHeader = () => {
  const username = process.env.SS_USER_NAME;
  const password = process.env.SS_PASSWORD;
  const base64Auth = Buffer.from(`${username}:${password}`).toString("base64");
  return {
    Authorization: `Basic ${base64Auth}`,
  };
};

//code for fetch all style ID
exports.fetchAllStyleIdsFromSandS = async () => {
  try {
    const response = await axios.get(`${process.env.SS_API_URL}/styles`, {
      headers: getAuthHeader(),
    });

    const styles = response.data;
    // console.log("styles",styles)
    return styles.map(s => ({
      styleId: s.styleID,
      styleName: s.styleName || null,
      title: s.title || null,
      description: s.description || null,
      partNumber: s.partNumber || null,
      productBrandName: s.brandName || null,
      categories: s.categories || [],
      baseCategory: s.baseCategory || null,
      brandImage: s.brandImage || null,
    }));
    //[39,8263,7956];
    // const styleIds = [39];

    // console.log(`[S&S] Total styles fetched: ${styleIds.length}`);
    // return styleIds;
  } catch (error) {
    console.error("Error fetching style IDs:", error.message);
    throw error;
  }
};



const allowedStyleNames = new Set([
  "5000", "18500", "3000", "64000", "75000", "5000B", "19500", "5400", "2000", "18000",
  "8800", "64000B", "18500B", "42000", "5100P", "65000L", "A230", "A2009", "A2008",
  "A1005", "A401", "A704", "A430", "A514", "A498", "A588", "A554", "A556", "A432",
  "48000", "41870", "41830L", "4HM700", "1301", "1301GD", "RF498", "TR401", "2001CVC",
  "RF496", "RF494", "9001", "5389", "2001Y", "1PQ", "4120", "4104", "4123", "4108",
  "4213", "5040", "5100", "960", "1701", "5300", "5060", "1102", "920", "7702",
  "3001", "3001CVC", "4810GD", "4851GD", "3001Y", "3901", "6400", "3010", "3480",
  "4719", "4711", "4610", "6110", "3483", "6003", "S700", "S600", "S101", "S149",
  "T425", "S450", "S790", "S650", "CD100", "T435", "CHP190", "CD400", "212472",
  "212475", "212486", "212487", "212482", "212469", "212485", "141160", "1717",
  "6014", "1566", "9018", "9360", "1745", "3023CL", "1567", "1466", "4410", "1467",
  "1580", "1745Y", "1467Y", "4017", "GDH100", "GDH400", "GDH450", "GDH425", "EC1000",
  "EC1500", "EC1085", "EC5305", "EC1007U", "EC3000", "EC1075", "EC5300", "EC1070",
  "EC5200", "5280", "5180", "5180R", "5250", "4980", "P170", "P160", "5170", "F260",
  "054X", "4820", "F170", "5190", "5480", "5370", "5450", "5186", "W110", "482L",
  "P360", "5586", "42TB", "P473", "RS160", "H12L009", "H12L010", "H612L04", "H12L003",
  "H130093", "SS4500", "IND4000", "PRM3500", "IND280SL", "IND420XD", "PRM4500",
  "SS3000", "IND3000", "SS1000C", "PRM2500", "IND5000P", "SS1000", "PRM4500MX",
  "IND5000C", "PRM33SBP", "EXP20PQ", "PRM1500Y", "8871", "8824", "8115", "8750",
  "8752", "8720", "8721", "29MR", "996MR", "562MR", "995MR", "29BR", "29LSR",
  "996YR", "560MR", "562BR", "4662MR", "IC48MR", "C12MR", "LS14001", "LS16005",
  "LS16001", "LS14004", "LST004", "LS19001", "LS18002", "LS15001", "LS1401Y",
  "LS16004", "LS1104", "6901", "6101", "6926", "2225", "2296", "6925", "3518",
  "6902", "3520", "6904", "6934", "3519", "6210", "3600", "6010", "3312", "6410",
  "3310", "6200", "7200", "6211", "3601", "7610", "9302", "9087", "9304", "9003",
  "9007", "FOA402994", "FOA402991", "FOA402992", "220", "210", "200", "222", "216",
  "221Y", "228", "204", "698HBM", "695HBM", "64STTM", "629X2M", "64LTTM", "631X2M",
  "600MRUS", "820NSM", "629X2B", "SHGD", "SHMHSS", "SHGDD", "SHASS", "SHMHLS", "MCS",
  "SHGDN", "SHMHSST", "SHGFC", "SHGWS", "SHDLP", "SHEHP", "T1000", "102A", "C1200",
  "T400HW", "T2000", "180A", "320H", "T3000", "202A", "600A", "1370399", "1376842",
  "1383255", "1376844", "1370431", "1379757", "1377374", "1376862", "1376907",
  "1385910", "1370379", "1383264", "1386016", "1376843", "1376847", "1377376",
  "1377487", "1389853", "1370155", "1379500", "1387124", "1379755", "1376852",
  "1389864", "1383260", "1389661", "1379492", "1383284", "1383259", "137508",
  "1383272", "1383256", "1377488", "8422", "8420", "8622", "8620", "8420Y",
  "TM110AB", "TM109AB", "TM405H", "TM310", "TM616", "TM654"
]);







exports.fetchAllStyleIdsWhihcClientNeedsFromSandS = async () => {
  try {
    // 1. Get allowed brand names from DB
    const brandDocs = await allBrandsNameSchema.find({}, { Name: 1 });
    const allowedBrandsSet = new Set(brandDocs.map(b => b.Name));

    // 2. Fetch all styles from S&S
    const response = await axios.get(`${process.env.SS_API_URL}/styles`, {
      headers: getAuthHeader(),
    });

    const allStyles = response.data;

    // 3. Filter styles by brand + styleName
    const matchingStyles = allStyles
      .filter(style =>
        allowedBrandsSet.has(style.brandName) &&
        allowedStyleNames.has(style.styleName)
      )
      .map(s => ({
        styleId: s.styleID,
        styleName: s.styleName || null,
        title: s.title || null,
        description: s.description || null,
        partNumber: s.partNumber || null,
        productBrandName: s.brandName || null,
        categories: s.categories || [],
        baseCategory: s.baseCategory || null,
        brandImage: s.brandImage || null,
      }));

    console.log(`✅ Found ${matchingStyles.length} matching styles out of ${allStyles.length}`);
    return matchingStyles;

  } catch (error) {
    console.error("❌ Error fetching style IDs:", error.message);
    throw error;
  }
};



async function withRetry(fn, retries = 3, delayMs = 2000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      if (err.response?.status === 503) {
        console.warn(`🔁 Retry ${attempt + 1} due to throttling...`);
        await delay(delayMs);
        attempt++;
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}



//for delete products from shopify whihc is not in S&S
// const deleteShopifyProduct = async (shopifyProductId) => {
//   try {
//     const shopifyProductId = "7442829967494"
//     const deleteProductMutation = `
//               mutation productDelete($input: ProductDeleteInput!) {
//               productDelete(input: $input) {
//                 deletedProductId
//                 userErrors {
//                 field
//                 message
//               }
//             }
//           }
//         `;

//     const variables = {
//       input: {
//         id: `gid://shopify/Product/${shopifyProductId}`  // <-- must be full GID
//       }
//     };

//     const result = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/graphql.json`,
//       { query: deleteProductMutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );


//     const deletionErrors = result.data.errors || result.data.data?.productDelete?.userErrors;
//     console.log("deletionErrors", deletionErrors);
//     if (deletionErrors?.length) {
//       console.error("❌ Shopify productDelete failed:", JSON.stringify(deletionErrors, null, 2));
//     } else {
//       console.log("✅ Product deleted successfully");
//     }
//   } catch (err) {
//     console.error(`❌ Failed to delete product ${shopifyProductId}:`, err.message);
//   }
// };



// const deleteShopifyVariant = async (variantId) => {

//   try {

//     const response = await axios.delete(
//       `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/variants/${variantId}.json`,
//       {
//         headers: {
//           'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     console.log(`✅ Variant ${variantId} deleted successfully`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Failed to delete variant ${variantId}:`, error.response?.data || error.message);
//     return null;
//   }
// };

const deleteShopifyProduct = async (id) => {
  console.log(`🧪 [MOCK] Deleting product: ${id}`);
};

const deleteShopifyVariant = async (variantId) => {
  console.log(`🧪 [MOCK] Deleting variant: ${variantId}`);
};

exports.updateUploadBrandSchema = async () => {
  try {
    // ✅ All styles in DB are already filtered (brand + category)
    const styles = await StyleIdSyncJob.find({}, 'styleId title productBrandName _id brandImage baseCategory');

    const bulkOps = [];

    // ✅ Build one update per unique brand directly from styles
    const brandStyleMap = new Map();

    for (const style of styles) {
      const brandName = style.productBrandName;
      if (!brandStyleMap.has(brandName)) {
        brandStyleMap.set(brandName, {
          styleIds: [],
          styleIdStrings: [],
          brandImage: null
        });
      }

      const entry = brandStyleMap.get(brandName);
      entry.styleIds.push(style._id);
      entry.styleIdStrings.push(style.styleId);

      if (!entry.brandImage && style.brandImage) {
        entry.brandImage = style.brandImage;
      }
    }

    for (const [brandName, data] of brandStyleMap.entries()) {
      bulkOps.push({
        updateOne: {
          filter: { BrandName: brandName },
          update: {
            $set: {
              styleIds: data.styleIds,
              styleIdStrings: data.styleIdStrings,
              totalStyleIds: data.styleIds.length,
              BrandSyncStatus: "pending",
              pendingStyleIds: [],
              lastAttempedBrandSync: null,
              error: null,
              brandImage: data.brandImage || ""
            }
          },
          upsert: true
        }
      });
    }

    if (bulkOps.length > 0) {
      await uploadBrandSchema.bulkWrite(bulkOps);
      console.log(`✅ Updated ${bulkOps.length} brands in uploadBrandSchema`);
    }

    const uniqueMatchedStyleIds = [...new Set(
      styles.map(style => style.styleId)
    )];

    console.log(`🚀 Fetching + saving products/specs for ${uniqueMatchedStyleIds.length} style IDs`);
    const toDelete = [];
    for (const styleId of uniqueMatchedStyleIds) {
      try {

        const ssData = await withRetry(() => this.fetchSSProductsByStyleIds(styleId));
        await delay(1000);

        const specs = await withRetry(() => this.fetchSSpecsByStyleId(styleId));
        await delay(1000);

        const noProducts = !Array.isArray(ssData) || ssData?.length === 0;

        if (!noProducts) {
          await this.saveSSProductsAndSpecsData(ssData, specs);
          console.log(`✅ Saved products/specs for styleID: ${styleId}`);
        } else {
          // console.warn(`⚠️ No products for styleID: ${styleId}`);
          //for testing purposes
          toDelete.push(styleId);
          console.warn(`⚠️ No products for styleID: ${styleId}, triggering deletion push data for delete`);
          // await this.handleProductDeletion(styleId);
        }
      } catch (err) {
        console.error(`❌ Failed for styleID ${styleId}:`, err.message);
      }
    }

    return toDelete;;

  } catch (error) {
    console.error("❌ Error in updateUploadBrandSchema:", error.message);
    throw error;
  }
};

exports.handleProductDeletion = async (styleID) => {
  try {
    const products = await SSProductMapping.find({ styleID });

    if (!products.length) {
      console.log(`ℹ️ No products found in DB for styleID: ${styleID}. Skipping deletion.`);
      return;
    }

    const productToDelete = products[0]; // Use first one to access shopifyProductId
    const deletedSkus = products.map(p => p.sku);

    // Step 1: Delete from Shopify (only if productId exists)
    if (productToDelete.shopifyProductId) {
      await deleteShopifyProduct(productToDelete.shopifyProductId);
      console.log(`🗑️ Deleted Shopify product: ${productToDelete.shopifyProductId}`);
    } else {
      console.warn(`⚠️ No Shopify product ID for styleID ${styleID}, skipping Shopify deletion`);
    }

    // Step 2: Delete all variants from local DB
    await SSProductMapping.deleteMany({ styleID });
    console.log(`🧹 Removed all SKUs from local DB for styleID: ${styleID}`);

    // Step 3: Remove from StyleIdSyncJob
    await StyleIdSyncJob.deleteOne({ styleId: styleID });
    console.log(`🧾 Removed sync job for styleID: ${styleID}`);

    // Step 4: Track this deletion in DeletedSyncRecords
    await deletedSyncRecords.create({
      styleId: styleID,
      skus: deletedSkus,
      deletedAt: new Date(),
      shopifyProductId: productToDelete.shopifyProductId || null,
      reason: "All variants removed"
    });

    console.log(`✅ Logged deletion for styleID: ${styleID}`);
  } catch (err) {
    console.error(`❌ Error in handleProductDeletion for styleID ${styleID}:`, err.message);
  }
};


function upgradeImageUrls(product) {
  const imageFields = [
    "colorFrontImage",
    "colorBackImage",
    "colorDirectSideImage",
    "colorOnModelFrontImage",
    "colorOnModelSideImage",
    "colorOnModelBackImage",
  ];

  for (const field of imageFields) {
    if (product[field]?.includes('_fm.jpg')) {
      product[field] = product[field].replace('_fm.jpg', '_fl.jpg');
    }
  }

  return product;
}

exports.saveSSProductsAndSpecsData = async (ssProducts, specData = []) => {
  try {
    if (!ssProducts?.length) return { success: true, message: "No products to sync." };

    const bulkOps = [];
    const styleID = ssProducts[0].styleID;
    const newSkusSet = new Set();
    const productIds = [];

    const blockedSizes = ["4XL", "5XL", "6XL", "7XL", "8XL"];
    let skippedCount = 0;
    // Build upsert ops for new/updated products
    for (const product of ssProducts) {

      const isAnyImageMissing =
        !product.colorSwatchImage?.trim() ||
        !product.colorFrontImage?.trim() ||
        !product.colorDirectSideImage?.trim() ||
        !product.colorBackImage?.trim() ||
        !product.colorOnModelFrontImage?.trim() ||
        !product.colorOnModelSideImage?.trim() ||
        !product.colorOnModelBackImage?.trim();



      // Skip if size is in the blocked list
      const isSizeBlocked = blockedSizes.includes(product.sizeName?.trim());

      if (isAnyImageMissing || isSizeBlocked) {
        skippedCount++;
        console.warn(`⚠️ Skipping variant (SKU: ${product.sku}) — one or more core images missing`);
        continue;
      }

      // ⬆️ Upgrade image URLs to high-res
      upgradeImageUrls(product);

      if (product.qty < 25) {
        product.qty = 0;
        console.log("QTY is less then 25 Mark as ZERO QTY for Out of Stock")
      }

      newSkusSet.add(product.sku);



      const matchingSpecs = specData
        .filter(spec => spec.styleID === product.styleID && spec.sizeName === product.sizeName)
        .map(spec => ({
          specName: spec.specName,
          value: spec.value
        }));

      const doc = {
        ...product,
        warehouses: product.warehouses || [],
        specs: matchingSpecs,
        shopifyProductId: product.shopifyProductId || null,
        shopifyProductData: product.shopifyProductData || null,
        shopifyVariantId: product.shopifyVariantId || null,
        shopifyInventoryId: product.shopifyInventoryId || null,
        shopifyInventoryStatus: "pending",
        shopifyDataUpdateStatus: "pending",
      };

      bulkOps.push({
        updateOne: {
          filter: { sku: product.sku, styleID },
          update: { $set: doc },
          upsert: true
        }
      });
    }

    // Upsert new products
    if (bulkOps.length) {
      await SSProductMapping.bulkWrite(bulkOps);
      console.log(`[✅] Synced ${bulkOps.length} products for styleID: ${styleID}`);
    }

    // 🔄 Update products array in StyleIdSyncJob
    const allSyncedProducts = await SSProductMapping.find({ styleID }, '_id');
    const productObjectIds = allSyncedProducts.map(p => p._id);

    await StyleIdSyncJob.updateOne(
      { styleId: styleID },
      { $set: { products: productObjectIds } }
    );

    return { success: true };

  } catch (err) {
    console.error("❌ Error in saveSSProductsAndSpecsData:", err.message);
    return { success: false, error: err.message };
  }
};




exports.fetchAllStyleIdsFromDB = async () => {
  try {
    const styles = await StyleIdSyncJobSchema.find({}, { styleId: 1, _id: 0 }); // Only return styleId
    const styleIds = styles.map((s) => s.styleId);
    return styleIds;
  } catch (error) {
    console.error("Error fetching style IDs from DB:", error.message);
    throw error;
  }
};



const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



async function withRetry(fn, retries = 3, delayMs = 2000) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      const status = err.response?.status || err.code;

      const isThrottle =
        status === 503 &&
        (err.message?.toLowerCase().includes("throttle") ||
          err.response?.data?.message?.toLowerCase().includes("throttle"));

      if (isThrottle) {
        const waitTime = 60000; // Wait 60 seconds
        console.warn(`🔁 Retry ${attempt + 1} due to throttling... Waiting ${waitTime / 1000}s`);
        await delay(waitTime);
        attempt++;
      } else if (attempt < retries - 1) {
        console.warn(`🔁 Retry ${attempt + 1} due to error: ${err.message}. Waiting ${delayMs / 1000}s`);
        await delay(delayMs);
        attempt++;
      } else {
        throw err;
      }
    }
  }

  throw new Error("Max retries exceeded");
}


exports.fetchSSProductsByStyleIds = async (styleId) => {
  try {
    const response = await axios.get(`${process.env.SS_API_URL}/products`, {
      headers: getAuthHeader(),
      params: {
        styleid: styleId,
      },
    });

    const products = response?.data || [];
    return products;
  } catch (error) {
    console.error("Error fetching S&S products by styleID:", error.response?.status, error.response?.data || error.message);
    return [];
  }
};

exports.fetchSingleProductSSByStyleId = async (styleIds) => {
  try {
    const allProducts = [];

    for (const styleId of styleIds) {
      const response = await axios.get(`${process.env.SS_API_URL}/products`, {
        headers: getAuthHeader(),
        params: {
          styleid: styleId,
        },
      });

      const products = response.data;
      allProducts.push(...products);
      console.log(`[S&S] Fetched styleID ${styleId} with ${products.length} SKUs`);
      await delay(1000);
    }

    return {
      total: allProducts.length,
      products: allProducts,
    };
  } catch (error) {
    console.error("Error fetching S&S products by styleID:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
};





exports.fetchSSpecsByStyleId = async (styleIds) => {
  try {
   
    const response = await axios.get(`${process.env.SS_API_URL}/specs/?style=${styleIds}`, {
      headers: getAuthHeader()
    });
   
    return response.data || [];
   
  } catch (error) {
    console.error("Error fetching S&S Specs by styleID:", error.response?.status, error.response?.data || error.message);
    return [];
  }
};


exports.fetchSSInventoryByStyleId = async (styleId) => {
  try {

    const response = await axios.get(`${process.env.SS_API_URL}/inventory?style=${styleId}`, {
      headers: getAuthHeader()
    });

    const inventory = response.data || [];
    return inventory;
  } catch (error) {
    console.error("Error fetching S&S Inventory:", error.response?.status, error.response?.data || error.message);
    throw error;
  }

};



exports.fetchSSInventoryQTYBySKU = async (sku) => {
  try {
    console.log(`🔍 Fetching S&S Inventory for SKU: ${sku}`);

    const response = await axios.get(`${process.env.SS_API_URL}/inventory/${sku}`, {
      headers: getAuthHeader()
    });
    const inventoryArray = response.data;

    if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
      console.warn('⚠️ No inventory data returned for SKU:', sku);
      return {
        sku,
        totalQty: 0,
        warehouses: []
      };
    }

    const inventory = inventoryArray[0]; // Single SKU object
    const warehouses = Array.isArray(inventory.warehouses) ? inventory.warehouses : [];

    const totalQty = warehouses.reduce((sum, w) => sum + (parseInt(w.qty, 10) || 0), 0);

    const result = {
      sku: inventory.sku,
      styleId: inventory.styleID,
      totalQty,
      warehouses: warehouses.map(w => ({
        warehouse: w.warehouseAbbr,
        qty: parseInt(w.qty, 10)
      }))
    };

    // console.log('✅ Inventory Result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching S&S Inventory:', error.response?.status, error.response?.data || error.message);
    throw new Error('Failed to fetch inventory from S&S');
  }
};


exports.getProductsFromDBByStyleId = async (styleId) => {
  try {
    const query = styleId ? { styleID: styleId } : {};

    const response = await SSProductMapping.find(query).lean();

    const productData = response || [];
    return productData;
  } catch (error) {
    console.error("Error fetching productData:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


exports.getProductsFromDb = async (styleId) => {
  try {

    const response = SSProductMapping.find().lean();

    const productData = response || [];
    return productData;
  } catch (error) {
    console.error("Error fetching productData:", error.response?.status, error.response?.data || error.message);
    throw error;
  }

};


