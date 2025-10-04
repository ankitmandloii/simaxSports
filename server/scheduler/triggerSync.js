
const StyleIdSyncJob = require("../model/StyleIdSyncJob");
const { uploadToShopify } = require("../services/shopify.service.js");
const { mapProducts } = require("../utils/mapper.js");
const SSProductMapping = require("../model/SSProductMapping.js");
const { default: axios } = require("axios");




exports.createSmartCollectionForBaseCategory = async (baseCategoryName, tag, brandImageUrl) => {
  const imageUrl = brandImageUrl
    ? `https://cdn.ssactivewear.com/${brandImageUrl}`
    : "https://default.image.url";

  const collectionTitle = `${baseCategoryName}`;

  const collectionData = {
    "smart_collection": {
      "title": collectionTitle,
      "body_html": `<strong>${baseCategoryName} collection for 2025</strong>`,
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
    await this.createSmartCollectionForBaseCategory(job.baseCategory, job.baseCategory, job.brandImage);
    
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