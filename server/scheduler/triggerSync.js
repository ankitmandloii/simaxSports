const { syncSandsToShopifytest } = require("../controller/sync.controller");
const StyleIdSyncJob = require("../model/StyleIdSyncJob");
const { fetchSSProductsByStyleIds, saveSSProductsAndSpecsData, fetchSSpecsByStyleId, updateStyleIdSyncJobProducts } = require("../services/ssApi.service");
const { uploadToShopify } = require("../services/shopify.service.js");
const { mapProducts } = require("../utils/mapper.js");
const SSProductMapping = require("../model/SSProductMapping.js");







exports.syncStyle = async (styleID) => {
  const job = await StyleIdSyncJob.findOne({ styleId: styleID });

  try {
    // Fetch data for the style
    let ssData, specs;

    try {
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


    // Upload to Shopify (upload only the first product for now)
    const uploaded = await uploadToShopify(shopifyFormatted);

    // Mark job as successful
    job.status = "success";
    job.syncedProducts = uploaded.length;
    job.lastAttemped = new Date();
    job.totalProducts = ssData.length || 0;
    await job.save();

    return true;

  } catch (error) {
    // If an error occurs, mark job as failed and save the error message
    job.status = "failed";
    job.error = error.message;
    await job.save();

    console.error("[SYNC ERROR]", error.message);

    // Return a structured failure response
    return false;
  }
};