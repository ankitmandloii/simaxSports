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










/////////////////////////////////verinats creation code for checkout flow/////////////////////////// //////////////////////////////////////////////////////
// const getProductVariantsFromDB = async (productId) => {
//   return await ProductVariant.find({ product_id: productId }).sort({ created_at: 1 }); // Sort by oldest first
// };


// const deleteVariantFromDB = async (variantId) => {
//   return await ProductVariant.deleteOne({ variant_id: variantId });
// };

// const insertVariantToDB = async (variantData) => {
//   const newVariant = new ProductVariant(variantData);
//   return await newVariant.save();
// };

// function makeUniqueSku(baseSku, product_id, option1, option2, { withTimestamp = true } = {}) {
//   const payload = JSON.stringify({ product_id, option1, option2, t: withTimestamp ? Date.now() : '' });
//   const hash = crypto.createHash('sha1').update(payload).digest('hex').slice(0, 8).toUpperCase();
//   // Result: B665D8502-S10-BLACK10-AB12CD34 (<= 32 chars typical)
//   return `${String(baseSku).toUpperCase()}-${String(option1).toUpperCase()}-${String(option2).toUpperCase()}-${hash}`;
// }



// const deleteVariantFromShopify = async (productId, variantId) => {
//   // Step 1: Get all product images
//   const imagesRes = await axios.get(
//     `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}/images.json`,
//     {
//       headers: {
//         'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//       }
//     }
//   );

//   const images = imagesRes.data.images || [];

//   // Step 2: Find images linked to this variant
//   const variantImages = images.filter(img =>
//     Array.isArray(img.variant_ids) && img.variant_ids.includes(variantId)
//   );

//   // Step 3: Delete those images
//   for (const img of variantImages) {
//     await axios.delete(
//       `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}/images/${img.id}.json`,
//       {
//         headers: {
//           'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//         }
//       }
//     );
//     console.log(`Deleted image ${img.id} for variant ${variantId}`);
//   }

//   // Step 4: Delete the variant itself
//   await axios.delete(
//     `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}/variants/${variantId}.json`,
//     {
//       headers: {
//         'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//       }
//     }
//   );

//   console.log(`Deleted variant ${variantId} from product ${productId}`);
// };


// const getProduct = async (productId) => {
//   const response = await axios.get(
//     `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}.json`,
//     {
//       headers: {
//         'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//       }
//     }
//   );
//   return response.data.product;
// };



// const updateProductOptions = async (productId) => {
//   await axios.put(
//     `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}.json`,
//     {
//       product: {
//         id: productId,
//         options: [
//           { name: 'Size', position: 1 },
//           { name: 'Color', position: 2 }
//         ]
//       }
//     },
//     {
//       headers: {
//         'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//       }
//     }
//   );
// };


// const attachImageToVariant = async (productId, imageUrl, variantId) => {
//   const response = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}/images.json`,
//     {
//       image: {
//         src: imageUrl,
//         variant_ids: [variantId]
//       }
//     },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//       }
//     }
//   );
//   return response.data.image;
// };


// const getInventoryItemIdFromVariant = async (variantId) => {
//   try {
//     const response = await axios.get(
//       `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variantId}.json`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//         }
//       }
//     );

//     return response.data.variant.inventory_item_id;  // Extract inventory_item_id
//   } catch (error) {
//     console.error('Error fetching inventory item ID from variant:', error.response?.data || error.message);
//     throw new Error('Failed to retrieve inventory item ID');
//   }
// };



// const updateInventoryInShopify = async (variantId, quantity, locationId) => {
//   try {
//     console.log("updateInventoryInShopify", quantity)
//     // Step 1: Get the inventory_item_id from the variantId
//     const inventoryItemId = await getInventoryItemIdFromVariant(variantId);
//     console.log("ssss", inventoryItemId);

//     // (Optional but safe) connect item to location once; ignore "already connected" errors
//     try {
//       await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/connect.json`,
//         {
//           inventory_item_id: Number(inventoryItemId),
//           location_id: Number(locationId),
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
//           },
//         }
//       );
//     } catch (e) {
//       const msg = e?.response?.data;
//       if (msg && JSON.stringify(msg).toLowerCase().includes('already')) {
//         console.log('Inventory already connected to location, continuing…');
//       } else {
//         console.log('Connect attempt info:', msg || e.message);
//       }
//     }

//     // Step 2: Prepare the data to set the inventory level (absolute)
//     const payload = {
//       available: Number(quantity) || 0,
//       location_id: Number(locationId),
//       inventory_item_id: Number(inventoryItemId),
//     };
//     console.log("Inventory Level Data:", payload);

//     // Step 3: Correct endpoint/method/body (POST + set.json, flat payload)
//     const response = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/set.json`,
//       payload,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//         }
//       }
//     );

//     console.log(`Inventory updated for variant ${variantId} at location ${locationId}:`, response.data);
//   } catch (error) {
//     console.error('Error updating inventory in Shopify:', error.response?.data || error.message);
//   }
// };

// const setVariantImageUrlsMetafield = async (variantId, urls) => {
//   if (!Array.isArray(urls) || urls.length === 0) return;

//   // Shopify REST metafields: type=list.url, value must be a JSON string of an array
//   const payload = {
//     metafield: {
//       ownerId: variantId,
//       namespace: 'custom',
//       key: 'variant_images',
//       value: JSON.stringify(urls),
//       type: 'json'
//     }

//   };

//   const res = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variantId}/metafields.json`,
//     payload,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY // use your Admin token
//       }
//     }
//   );
//   return res.data.metafield;
// };


// exports.addProductVariants = async (req, res) => {

//   //   const variants = [];


//   //   for (let i = 1; i <= 20; i++) {
//   //     const _stamp = (Date.now() + Math.random().toString(36).slice(2,6)).toUpperCase();
//   //     const finalOption1 = `Black@-${_stamp}`;
//   //     const finalOption2 = `S-${_stamp}`;
//   // const uniqueSku = `B665D8503@-${_stamp}`;
//   //     variants.push({
//   //       product_id: "7449547407494",
//   //       option1: finalOption1,  // Unique size like S1, S2, S3, ...
//   //       option2: finalOption2,
//   //       price: "32.15",
//   //       sku: uniqueSku,  // Unique SKU
//   //       inventory_quantity: "10",
//   //       weight: "2520",
//   //       image_urls: [
//   //         "https://simaxdesigns.imgix.net/uploads/1755688448530_cake-1-4.jpg",
//   //         "https://simaxdesigns.imgix.net/uploads/1755691035014_rb2.png",
//   //         "https://simaxdesigns.imgix.net/uploads/1755683722888_cat_and_lion.png",
//   //         "https://simaxdesigns.imgix.net/uploads/1755495128786_grass_ai-1-0.jpg"
//   //       ],
//   //       location_id: 70287655046
//   //     });
//   //   }

//   const variants = Array.isArray(req.body) ? req.body : [req.body];
//   const results = [];

//   // --- Main loop ---
//   for (const item of variants) {
//     const {
//       product_id,
//       option1,
//       option2,
//       price,
//       sku,
//       inventory_quantity,
//       weight,
//       image_urls,
//       location_id
//     } = item;

//     if (!product_id || !option1 || !option2 || !price || !sku) {
//       results.push({
//         success: false,
//         error: 'Missing required fields (product_id, option1, option2, price, sku)',
//         input: item
//       });
//       continue;
//     }
//     console.log("location_id", location_id)

//     try {



//       // Step 1: Ensure product options are set
//       const product = await getProduct(product_id); // Assuming `getProduct` is defined

//       const productOptions = product.options.map(opt => opt.name.toLowerCase());

//       if (!productOptions.includes('size') || !productOptions.includes('color')) {
//         await updateProductOptions(product_id); // Assuming `updateProductOptions` is defined
//       }

//       // Step 2: Check variant count from the database (MongoDB)
//       const existingVariants = await getProductVariantsFromDB(product_id);

//       if (existingVariants.length >= 2) {
//         // Find and delete the oldest variant from the database and Shopify

//         const oldestVariant = existingVariants[0];  // Get the oldest variant
//         await deleteVariantFromShopify(product_id, oldestVariant.variant_id);  // Delete from Shopify
//         await deleteVariantFromDB(oldestVariant.variant_id);  // Delete from DB
//       }

//       const _stamp = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).toUpperCase();
//       // const finalOption1 = `${option1}-${_stamp}`;
//       const finalOption2 = `${option2}-${_stamp}`;
//       const uniqueSku = `${sku}-${_stamp}`;

//       console.log("finalOption2", finalOption2)
//       console.log("uniqueSku", uniqueSku)
//       // Step 3: Create new variant in Shopify
//       const variantData = {
//         variant: {
//           option1: option1,
//           option2: finalOption2,
//           price,
//           sku: uniqueSku,
//           inventory_quantity: inventory_quantity || 0,
//           inventory_management: 'shopify',
//           fulfillment_service: 'manual',
//           requires_shipping: true,
//           taxable: true,
//           weight: weight || 0.0,
//           weight_unit: 'lb'
//         }
//       };

    
//       const variantRes = await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${product_id}/variants.json`,
//         variantData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
//           }
//         }
//       );
//       console.log("variantRes", variantRes)
//       const variant = variantRes.data.variant;
//       if (location_id) {
//         console.log("location_id", location_id)
//         await updateInventoryInShopify(variant.id, inventory_quantity, location_id);
//       }
//       // Step 4: Upload images if provided
//       // const attachedImages = [];
//       // if (Array.isArray(image_urls)) {
//       //   for (const url of image_urls.slice(0, 4)) {
//       //     const img = await attachImageToVariant(product_id, url, variant.id);  // Assuming `attachImageToVariant` is defined
//       //     attachedImages.push(img);
//       //   }
//       // }
//       //badd wala code for metafirld 
//       // if (Array.isArray(image_urls) && image_urls.length > 0) {
//       //   // Upload ONLY the 0th image to Shopify
//       //   const firstUrl = image_urls[0];
//       //   const img = await attachImageToVariant(product_id, firstUrl, variant.id);
//       //   attachedImages.push(img);

//       //   // Save remaining URLs (index 1..n) in a VARIANT metafield as list.url
//       //   const remainingUrls = image_urls.slice(1);
//       //   await setVariantImageUrlsMetafield(variant.id, remainingUrls);
//       // }
//       const attachedImages = [];
//       let imageMetafield = null;

//       if (Array.isArray(image_urls) && image_urls.length > 0) {
//         // Upload the first image to Shopify so it shows in Admin
//         const firstUrl = image_urls[0];
//         const img0 = await attachImageToVariant(product_id, firstUrl, variant.id);
//         attachedImages.push(img0);

//         // Save ALL provided URLs (including index 0) to a variant metafield
//         imageMetafield = await setVariantImageUrlsMetafield(variant.id, image_urls);
//       }

//       // Step 5: Store the new variant in MongoDB
//       const variantDataToStore = {
//         product_id,
//         variant_id: variant.id,
//         sku: variant.sku,
//         price: variant.price,
//         inventory_quantity: variant.inventory_quantity,
//         created_at: new Date(),
//         updated_at: new Date(),
//         uploadedImage_url: attachedImages.length > 0 ? attachedImages[0].src : null,
//         S3_image_all_urls: Array.isArray(image_urls) ? image_urls : [],
//       };

//       await insertVariantToDB(variantDataToStore);  // Store variant in MongoDB

//       results.push({
//         success: true,
//         variant,
//         attached_images: attachedImages
//       });
//     } catch (err) {
//       results.push({
//         success: false,
//         input: item,
//         error: err.response?.data || err.message
//       });
//     }
//   }

//   // Final response
//   res.status(207).json({
//     message: 'Batch processing result',
//     summary: {
//       total: results.length,
//       success: results.filter(r => r.success).length,
//       failed: results.filter(r => !r.success).length
//     },
//     results
//   });
// };


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// for single varinats createDraftOrderforCheckout
// exports.createDraftOrderforCheckout = async (req, res) => {
//   try {


//     const { size, color, price, design, variantId ,sku,quantity ,PreviewImageUrl,vendor,custom} = req.body;

//     const draftOrderpayload = {
//       draft_order: {
//         line_items: [
//           {
//             title: `custom-tshirt`,
//             price: price,
//             sku: sku,
//             variant_id: variantId,
//             vendor: vendor,
//             custom: custom,
//             quantity: quantity,
//             properties: [
//               { name: "Color", value: color },
//               { name: "Size", value: size },
//               { name: "Design Front", value: design.front },
//               { name: "Design Back", value: design.back },
//               { name: "Design Left", value: design.left },
//               { name: "Design Right", value: design.right },
//               { name: "Preview Image", value: PreviewImageUrl }
//             ]
//           }
//         ]
//       }
//     };

//     const response = await axios.post(`https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-01/draft_orders.json`,
//       draftOrderpayload,
//       {
//         headers: {
//           'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
//           'Content-Type': 'application/json',
//         }
//       }
//     );

//     const draftOrder = response.data.draft_order;

//     res.json({ checkoutUrl: draftOrder.invoice_url });


//   } catch (err) {
//     console.error("ERR creating draft order:", err.response?.data || err.message);
//     res.status(500).json({ err: "failed to create draft order" });

//   }

//   // Final response

// };




exports.createDraftOrderforCheckout = async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body) ? req.body : (req.body.items || []);
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ err: "Provide an array of line items or { items: [...] }" });
    }

    // Choose currency for MoneyInput
    const currencyCode =
      req.body.currencyCode ||
      process.env.SHOP_CURRENCY || // e.g. "USD", "INR", "EUR"
      "USD";

    const toMoney = (v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) { throw new Error(`invalid price: ${v}`); }
      return { amount: n.toFixed(2), currencyCode }; // <-- MoneyInput
    };

    const buildAttrs = (it) => {
      const attrs = [];
      const add = (key, val) => { if (val !== undefined && val !== null && String(val) !== "") attrs.push({ key, value: String(val) }); };
      add("Color", it.color);
      add("Size", it.size);
      if (it.design) {
        add("Design Front", it.design.front);
        add("Design Back", it.design.back);
        add("Design Left", it.design.left);
        add("Design Right", it.design.right);
      }
      add("Preview Image", it.PreviewImageUrl || it.previewImageUrl);
      return attrs;
    };

    const toGID = (typename, id) => String(id).startsWith("gid://") ? String(id) : `gid://shopify/${typename}/${id}`;

    const lineItems = rawItems.map((it) => {
      const quantity = parseInt(String(it.quantity ?? 1), 10) || 1;
      const hasVariant = it.variant_id != null || it.variantId != null;

      const base = {
        quantity,
        customAttributes: buildAttrs(it),
        // `sku`, `title`, `taxable`, `requiresShipping` are ignored on variant lines per docs
        ...(typeof it.taxable === "boolean" ? { taxable: it.taxable } : {}),
        ...(typeof it.requires_shipping === "boolean" ? { requiresShipping: it.requires_shipping } : {}),
      };

      if (hasVariant) {
        return {
          ...base,
          variantId: toGID("ProductVariant", it.variant_id ?? it.variantId),
          priceOverride: toMoney(it.price), // <-- MoneyInput for variant lines
        };
      } else {
        return {
          ...base,
          title: it.title || "custom-tshirt",
          originalUnitPriceWithCurrency: toMoney(it.price), // <-- MoneyInput for custom lines
          ...(it.sku ? { sku: String(it.sku) } : {}),
        };
      }
    });

    const mutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder { id invoiceUrl }
          userErrors { field message }
        }
      }
    `;

    const variables = { input: { lineItems } };

    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
      { query: mutation, variables },
      { headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY, "Content-Type": "application/json" } }
    );

    const errs = response.data?.data?.draftOrderCreate?.userErrors;
    if (errs?.length) return res.status(400).json({ err: "draftOrderCreate userErrors", details: errs });

    const draftOrder = response.data?.data?.draftOrderCreate?.draftOrder;
    if (!draftOrder) return res.status(500).json({ err: "No draftOrder returned", details: response.data });

    return res.json({ id: draftOrder.id, checkoutUrl: draftOrder.invoiceUrl });
  } catch (err) {
    console.error("ERR creating draft order (GraphQL):", err.response?.data || err.message);
    return res.status(500).json({ err: "failed to create draft order", details: err.response?.data || err.message });
  }
};


// controller/products.js
exports.productsSearch = async (req, res) => {
  try {
    const q = (req.query.query || '').trim();
    if (!q) {
      return sendResponse(res, statusCode.BAD_REQUEST, false, 'query is required');
    }
    const limit = Math.min(Number(req.query.limit) || 20, 250);
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

