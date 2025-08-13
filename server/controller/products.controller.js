const services = require("../services/products.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const { default: axios } = require("axios");
const ProductVariant = require('../model/ProductVariantSchema.js'); // Import the MongoDB model



exports.productList = async (req, res) => {
    try {
        const { limit, cursor } = req.body;

        const result = await services.getProductsList(limit, cursor);
        if (!result) {
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.DATA_NOT_FOUND);
        }

        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


// exports.productFilter = async (req, res) => {
//     try {
//         // Extract the product title from body
//         const title = req.body.title;

//         // Set the limit for the number of items to fetch
//         const limit = req.body.limit;

//         // Determine if a cursor is provided to fetch results after a specific point
//         const cursor = req.body.cursor;
//         const isCursor = cursor ? `after:"${cursor}",` : "";
//         const result = await services.getProductFilter(title, limit, isCursor);


//         if (!result) {
//             return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.PRODUCT_FETCHED);
//         }
//         return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
//     } catch (error) {
//         console.log(error)
//         return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
//     }
// };




//getCollection List Api 

exports.getAllCollectionList = async (req, res) => {
    try {
        // Set the limit for the number of items to fetch
        const limit = req.body.limit;

        // Determine if a cursor is provided to fetch results after a specific point
        const cursor = req.body.cursor;

        //Calling over collection list service to get the list of collections
        const result = await services.getAllCollectionList(limit, cursor);
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
};


//product by collectionId 

exports.productsByCollectionId = async (req, res) => {
    try {

        const collectionId = req.params.id;
        const limit = req.body.limit;
        const cursor = req.body.cursor;

        const result = await services.getProductsByCollectionId(limit, collectionId, cursor)
        if (!result) {
            return sendResponse(res, statusCode.NOT_FOUND, false, ErrorMessage.DATA_NOT_FOUND);
        }
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result)
    } catch (error) {
        console.log(error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}




//on shopify product varint create 






// const variants = [];

//     for (let i = 1; i <= 105; i++) {
//       variants.push({
//         product_id: 7435096785030,
//         option1: `S${i}`,  // Unique size like S1, S2, S3, ...
//         option2: "Black",
//         price: "32.15",
//         sku: `B665D8502-${i}`,  // Unique SKU
//         inventory_quantity: 10,
//         image_urls: [
//           "https://simaxdesigns.imgix.net/uploads/1753094129600_front-design.png"
//         ]
//       });
//     }

// console.log(JSON.stringify(variants, null, 2));




// Helper function to get variants for a product from MongoDB
const getProductVariantsFromDB = async (productId) => {
  return await ProductVariant.find({ product_id: productId }).sort({ created_at: 1 }); // Sort by oldest first
};

// Helper function to delete variant from MongoDB
const deleteVariantFromDB = async (variantId) => {
  return await ProductVariant.deleteOne({ variant_id: variantId });
};

// Helper function to insert a new variant into MongoDB
const insertVariantToDB = async (variantData) => {
  const newVariant = new ProductVariant(variantData);
  return await newVariant.save();
};




// `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/products/${productId}/variants/${variantId}.json`,
const deleteVariantFromShopify = async (productId, variantId) => {
  await axios.delete(
    `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}/variants/${variantId}.json`,
    {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
      }
    }
  );
};

// `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/products/${productId}.json`,
    const getProduct = async (productId) => {
        const response = await axios.get(
            `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}.json`,
            {
                headers: {
                    'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
                }
            }
        );
        return response.data.product;
    };

    
    // `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/products/${productId}.json`,
    const updateProductOptions = async (productId) => {
        await axios.put(
            `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}.json`,
            {
                product: {
                    id: productId,
                    options: [
                        { name: 'Size', position: 1 },
                        { name: 'Color', position: 2 }
                    ]
                }
            },
            {
                headers: {
                    'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
                }
            }
        );
    };

    // `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/products/${productId}/images.json`,
        const attachImageToVariant = async (productId, imageUrl, variantId) => {
        const response = await axios.post(
            `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}/images.json`,
            {
                image: {
                    src: imageUrl,
                    variant_ids: [variantId]
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
                }
            }
        );
        return response.data.image;
    };

    // `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/variants/${variantId}.json`,
    const getInventoryItemIdFromVariant = async (variantId) => {
  try {
    const response = await axios.get(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variantId}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
        }
      }
    );

    return response.data.variant.inventory_item_id;  // Extract inventory_item_id
  } catch (error) {
    console.error('Error fetching inventory item ID from variant:', error.response?.data || error.message);
    throw new Error('Failed to retrieve inventory item ID');
  }
};

const updateInventoryInShopify = async (variantId, quantity, locationId) => {
  try {
    // Step 1: Get the inventory_item_id from the variantId
    const inventoryItemId = await getInventoryItemIdFromVariant(variantId);
    console.log("ssss",inventoryItemId)
    // Step 2: Prepare the data to update the inventory level at the specified location
    const inventoryLevelData = {
      inventory_level: {
        available: quantity,  // The new available quantity for this variant
        location_id: locationId,  // The location ID where the inventory needs to be updated
        inventory_item_id: inventoryItemId // The inventory item ID associated with the variant
      }
    };
   console.log("Inventory Level Data:", inventoryLevelData);  
   // Step 3: Send the request to Shopify to update the inventory level
  //  `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-01/inventory_levels/adjust.json`,
    const response = await axios.put(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/adjust.json`,
      inventoryLevelData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY  // Shopify API access token
        }
      }
    );

    // Log the response from Shopify (for debugging purposes)
    console.log(`Inventory updated for variant ${variantId} at location ${locationId}:`, response.data);
  } catch (error) {
    // If an error occurs, log the error message
    console.error('Error updating inventory in Shopify:', error.response?.data || error.message);
  }
};


    // const variants = [];
    
    //     for (let i = 1; i <= 95; i++) {
    //       variants.push({
    //         product_id: 7435096785030,
    //         option1: `S${i}`,  // Unique size like S1, S2, S3, ...
    //         option2: "Black",
    //         price: "32.15",
    //         sku: `B665D8502-${i}`,  // Unique SKU
    //         inventory_quantity: 10,
    //         image_urls: [
    //           "https://simaxdesigns.imgix.net/uploads/1753094129600_front-design.png"
    //         ]
    //       });
    //     }

exports.addProductVariants = async (req, res) => {
    
  const variants = Array.isArray(req.body) ? req.body : [req.body];
  const results = [];

  // --- Main loop ---
  for (const item of variants) {
    const {
      product_id,
      option1,
      option2,
      price,
      sku,
      inventory_quantity,
      weight,
      image_urls,
      location_id
    } = item;

    if (!product_id || !option1 || !option2 || !price || !sku) {
      results.push({
        success: false,
        error: 'Missing required fields (product_id, option1, option2, price, sku)',
        input: item
      });
      continue;
    }

    try {



      // Step 1: Ensure product options are set
      const product = await getProduct(product_id); // Assuming `getProduct` is defined

      const productOptions = product.options.map(opt => opt.name.toLowerCase());

      if (!productOptions.includes('size') || !productOptions.includes('color')) {
        await updateProductOptions(product_id); // Assuming `updateProductOptions` is defined
      }

      // Step 2: Check variant count from the database (MongoDB)
      const existingVariants = await getProductVariantsFromDB(product_id);

      if (existingVariants.length >= 80) {
        // Find and delete the oldest variant from the database and Shopify
        const oldestVariant = existingVariants[0];  // Get the oldest variant
        await deleteVariantFromShopify(product_id, oldestVariant.variant_id);  // Delete from Shopify
        await deleteVariantFromDB(oldestVariant.variant_id);  // Delete from DB
      }

      // Step 3: Create new variant in Shopify
      const variantData = {
        variant: {
          option1,
          option2,
          price,
          sku,
          inventory_quantity: inventory_quantity || 0,
          inventory_management: 'shopify',
          fulfillment_service: 'manual',
          requires_shipping: true,
          taxable: true,
          weight: weight || 0.0,
          weight_unit: 'lb'
        }
      };

      // `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2023-07/products/${product_id}/variants.json`,
      const variantRes = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${product_id}/variants.json`,
        variantData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
          }
        }
      );

      const variant = variantRes.data.variant;
        if (location_id) {
        await updateInventoryInShopify(variant.id, inventory_quantity, location_id);
      }
      // Step 4: Upload images if provided
      const attachedImages = [];
      if (Array.isArray(image_urls)) {
        for (const url of image_urls.slice(0, 4)) {
          const img = await attachImageToVariant(product_id, url, variant.id);  // Assuming `attachImageToVariant` is defined
          attachedImages.push(img);
        }
      }

      // Step 5: Store the new variant in MongoDB
      const variantDataToStore = {
        product_id,
        variant_id: variant.id,
        sku: variant.sku,
        price: variant.price,
        inventory_quantity: variant.inventory_quantity,
        created_at: new Date(),
        updated_at: new Date(),
        image_url: attachedImages.length > 0 ? attachedImages[0].src : null
      };

      await insertVariantToDB(variantDataToStore);  // Store variant in MongoDB

      results.push({
        success: true,
        variant,
        attached_images: attachedImages
      });
    } catch (err) {
      results.push({
        success: false,
        input: item,
        error: err.response?.data || err.message
      });
    }
  }

  // Final response
  res.status(207).json({
    message: 'Batch processing result',
    summary: {
      total: results.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    },
    results
  });
};




// controller/products.js
exports.productsSearch = async (req, res) => {
  try {
    const q = (req.query.query || '').trim();
    if (!q) {
      return sendResponse(res, statusCode.BAD_REQUEST, false, 'query is required');
    }
    const limit  = Math.min(Number(req.query.limit) || 20, 250);
    const cursor = req.query.cursor || null;
    const collectionId = req.query.collectionId || null;

    const result = await services.searchProducts({ q, limit, cursor, collectionId });

    if (!result) {
      return sendResponse(res, statusCode.NOT_FOUND, false, 'No results');
    }

    return sendResponse(res, statusCode.OK, true, 'Search results', result);
  } catch (err) {
    console.error(err);
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};

