const axios = require("axios");
const SSProductMapping = require("../model/SSProductMapping");
const StyleIdSyncJob = require("../model/StyleIdSyncJob");




//done with new version
const getDefaultLocationId = async () => {
  try {
    const response = await axios.get(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/locations.json`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const locations = response.data.locations;
    if (locations.length === 0) {
      throw new Error("No locations found in Shopify store");
    }
    // Return the first location ID as default
    return locations[0].id;
   
  } catch (error) {
    console.error("Error fetching default location ID:", error.message);
    throw error;
  }
};




//done with new version
const findProductByHandle = async (handle) => {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
      }
    }
  `;

  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
      {
        query,
        variables: { handle }
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        }
      }
    );

    // Log the entire response for debugging
    // console.log("GraphQL Response:", response.data);

    // Extract the product ID from the response
    const productId = response.data.data?.productByHandle?.id;

    // Check if productId is found
    if (productId) {
       console.log("productIdproductIdproductIdproductId",productId.split('/').pop())
      return productId.split('/').pop();  // Extract the product ID
    } else {
      // console.log("Product not found with handle:", handle);
      return null;
    }
  } catch (error) {
    console.error("Error finding product by handle:", error.message);
    return null;
  }
};







//done with new version
// const retryAttachment = async (productId, variantId, mediaIds, retries = 5, delay = 2000) => {
//   let attempt = 0;
//   let success = false;

//   const productVariantAppendMediaMutation = `
//     mutation productVariantAppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
//       productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   while (attempt < retries && !success) {
//     try {
//       const mediaStatusResponse = await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
//         {
//           query: `query GetMediaStatus($mediaIds: [ID!]!) {
//             nodes(ids: $mediaIds) {
//               ... on MediaImage {
//                 status
//               }
//             }
//           }`,
//           variables: { mediaIds },
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const nodes = mediaStatusResponse?.data?.data?.nodes || [];
//       const allReady = nodes.every((node) => node?.status === 'READY');

//       if (allReady) {
//         const appendMediaVariables = {
//           productId,
//           variantMedia: [{
//             variantId,
//             mediaIds,
//           }],
//         };

//         const appendRes = await axios.post(
//           `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
//           {
//             query: productVariantAppendMediaMutation,
//             variables: appendMediaVariables,
//           },
//           {
//             headers: {
//               "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (appendRes.data.errors || appendRes.data.data.productVariantAppendMedia.userErrors.length) {
//           console.error('Media attachment errors:', appendRes.data.data.productVariantAppendMedia.userErrors);
//           throw new Error('Failed to attach media to variant');
//         }

//         success = true;
//         console.log(`✅ Attached media to variant ${variantId}`);
//       } else {
//         console.log(`⏳ Media not ready. Retrying in ${delay}ms...`);
//         await new Promise(res => setTimeout(res, delay));
//         delay = Math.min(delay * 2 + Math.random() * 100, 30000);
//         attempt++;
//       }
//     } catch (error) {
//       console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
//       attempt++;
//       if (attempt < retries) {
//         await new Promise(res => setTimeout(res, delay));
//       }
//     }
//   }

//   return success;
// };



const retryAttachment = async (productId, variantId, mediaIds, retries = 5, delay = 2000) => {
  let attempt = 0;
  let success = false;

  const productVariantAppendMediaMutation = `
    mutation productVariantAppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
      productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  while (attempt < retries && !success) {
    try {
      const mediaStatusResponse = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
        {
          query: `query GetMediaStatus($mediaIds: [ID!]!) {
            nodes(ids: $mediaIds) {
              ... on MediaImage {
                status
              }
            }
          }`,
          variables: { mediaIds },
        },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const nodes = mediaStatusResponse?.data?.data?.nodes || [];
      const allReady = nodes.every((node) => node?.status === 'READY');

      if (allReady) {
        const appendMediaVariables = {
          productId,
          variantMedia: [{
            variantId,
            mediaIds,
          }],
        };

        const appendRes = await axios.post(
          `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
          {
            query: productVariantAppendMediaMutation,
            variables: appendMediaVariables,
          },
          {
            headers: {
              "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (appendRes.data.errors || appendRes.data.data.productVariantAppendMedia.userErrors.length) {
          throw new Error('Failed to attach media to variant');
        }

        success = true;
        // console.log(`✅ Attached media to variant ${variantId}`);
      } else {
        console.log(`⏳ Media not ready. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay = Math.min(delay * 2 + Math.random() * 100, 30000);
        attempt++;
      }
    } catch (error) {
      console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
      attempt++;
    }
  }

  // console.log(`✅ Attached ALL media to variants`);
  return success;
};


//done with new version
const productVariantsCreate = async (productId, variants) => {
  const mutation = `
    mutation ProductVariantsCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, strategy: REMOVE_STANDALONE_VARIANT, variants: $variants) {
        productVariants {
          id
          title
          sku
          selectedOptions {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const locationId = await getDefaultLocationId();


  const variables = {
    productId: `gid://shopify/Product/${productId}`,
    variants: variants.map((variant) => {
      // Ensure optionValues are dynamically generated based on available options
      const optionValues = [
        { optionName: "Color", name: variant.option1 || "Default" },  // Ensure option1 is set
        { optionName: "Size", name: variant.option2 || "Default" }    // Ensure option2 is set
      ];




      return {
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        optionValues: optionValues, // Dynamically map option values
        barcode: variant.barcode,
        inventoryQuantities: [{
          locationId: `gid://shopify/Location/${locationId}`,
          availableQuantity: parseInt(variant.inventory_quantity) || 0,
        }],
        inventoryItem: {
          sku: variant.sku,
          measurement: {
            weight: {
              value: parseFloat(variant.weight),
              unit: variant.weight_unit || "POUNDS"
            }
          }
        },
      };
    }),
  };

  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
      { query: mutation, variables },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const dataResponse = response.data?.data?.productVariantsBulkCreate;

    if (!dataResponse) {
      console.error("❌ No response data received from Shopify");
      throw new Error("Variant creation failed: No response data");
    }

    if (dataResponse.userErrors?.length) {
      const errorMessages = dataResponse.userErrors.map(e => `${e.field}: ${e.message}`).join("; ");
      console.error(`❌ Shopify error: ${errorMessages}`);
      throw new Error("Variant creation failed: " + errorMessages);
    }

    return dataResponse.productVariants;
  } catch (err) {
    console.error("❌ Variant Creation Failed:", err.message);
    throw new Error(`Variant creation failed: ${err.message}`);
  }
};




//done with new version
const createProductGraphQL = async (product) => {
  const productCreateMutation = `
    mutation productCreate($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product {
          id
          title
          handle
          options {
            id
            name
          }
          variants(first: 250) {
            edges {
              node {
                id
                sku
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const locationId = await getDefaultLocationId();

    const productCreateVariables = {
      product: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: product.body_html,
        vendor: product.vendor,
        productType: product.product_type,
        tags: product.tags.split(",").map((tag) => tag.trim()),
        productOptions: [
          { name: "Color", values: [{ name: "Red" }] },
          { name: "Size", values: [{ name: "Small" }] },
        ],
      },
    };

    // Create the product in Shopify
    const createResponse = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
      { query: productCreateMutation, variables: productCreateVariables },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );



    const responseData = createResponse?.data;

    if (!responseData || !responseData.data || !responseData.data.productCreate) {
      console.error("❌ Unexpected response structure:", JSON.stringify(responseData, null, 2));
      throw new Error("Unexpected response format from Shopify during product creation.");
    }

    const productData = responseData.data.productCreate;

    if (productData.userErrors?.length) {
      const formattedErrors = productData.userErrors
        .map((e) => `${e.field?.join('.') || 'unknown'}: ${e.message}`)
        .join("; ");

      console.error("❌ Shopify userErrors during productCreate:", formattedErrors);
      throw new Error("Shopify productCreate failed: " + formattedErrors);
    }

    const productId = productData.product.id.split("/").pop();
    const productGID = productData.product.id;

    // Step 2: Upload images first
    const imageMediaMap = {};
    const imagesToUpload = product.images || [];

    if (imagesToUpload.length > 0) {
      Object.assign(imageMediaMap, await uploadImagesInBatches(productGID, imagesToUpload));
      const totalOk = Object.keys(imageMediaMap).length;
      console.log(`🖼️ [media] total mapped: ${totalOk}/${imagesToUpload.length}`);
    } else {
      console.log("🖼️ No new images to upload.");
    }

    // Step 3: Create actual variants (this will replace the default variant)
    console.log("Creating variants...");
    const createdVariants = await productVariantsCreate(productId, product.variants);

    // Step 4: Build SKU to Variant ID mapping from created variants
    const variantMap = {};
    createdVariants.forEach((v) => {
      variantMap[v.sku] = v.id;
    });

    console.log(`✅ Created ${createdVariants.length} variants`);

    // Step 5: Wait a bit for media to be fully ready
    await new Promise(res => setTimeout(res, 4000));

    // Step 6: Attach images to variants
    for (const variant of product.variants) {
      const variantId = variantMap[variant.sku];
      if (!variantId) {
        console.warn(`⚠️ Variant ID not found for SKU: ${variant.sku}`);
        continue;
      }

      const mediaIds = [];
      const imageUrl = variant.imageSrc;

      if (imageUrl && imageMediaMap[imageUrl]) {
        mediaIds.push(imageMediaMap[imageUrl]);
      }

      if (mediaIds.length > 0) {
        console.log(`Attaching media to variant ${variant.sku}...`);
        const success = await retryAttachment(productGID, variantId, mediaIds);

        if (!success && variant.sku) {
          console.warn(`❌ Failed to attach media to variant ${variant.sku} after multiple attempts.`);
          await markVariantAsFailedInSyncJob(variant.styleId, variant.sku);
        }
      } else {
        console.log(`⚠️ No media found for variant ${variant.sku}`);
      }
    }

    console.log(`✅ Completed media attachment process`);

    return productId;

  } catch (err) {
    console.error("❌ Product Creation Failed:", { title: product.title, error: err.message, stack: err.stack });
    throw new Error(`Product creation failed: ${err.message}`);
  }
};


//done with new version
const uploadImagesInBatches = async (productId, imagesToUpload, maxRetries = 3) => {
  const imageMediaMap = {};
  const BATCH_SIZE = 25;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const uploadBatch = async (slice, attempt = 1) => {
    const mediaUploadVariables = {
      productId,
      media: slice.map((img) => ({
        originalSource: img.src,
        alt: img.altText || `Image for ${productId}`,
        mediaContentType: "IMAGE",
      })),
    };

    const productCreateMediaMutation = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          id
          status
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `;

    try {
      const uploadRes = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
        {
          query: productCreateMediaMutation,
          variables: mediaUploadVariables,
        },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const result = uploadRes?.data?.data?.productCreateMedia;
      const ok = result?.media || [];
      const errs = result?.mediaUserErrors || [];

      console.log(`🖼️ [media] batch attempt ${attempt}: uploaded ${ok.length}/${slice.length}`);

      ok.forEach((media, idx) => {
        if (slice[idx]) {
          imageMediaMap[slice[idx].src] = media.id;
        }
      });

      const failedImages = [];
      if (ok.length < slice.length || errs.length) {
        slice.forEach((img) => {
          if (!imageMediaMap[img.src]) failedImages.push(img);
        });
      }

      if (failedImages.length && attempt < maxRetries) {
        console.warn(
          `⚠️ ${failedImages.length} images failed in batch, retrying attempt ${attempt + 1}`
        );
        await sleep(2000 * attempt);
        return uploadBatch(failedImages, attempt + 1);
      }

      return ok.length;
    } catch (err) {
      console.error(`❌ Batch upload failed (attempt ${attempt}):`, err.message);
      if (attempt < maxRetries) {
        await sleep(2000 * attempt);
        return uploadBatch(slice, attempt + 1);
      }
      return 0;
    }
  };

  for (let start = 0; start < imagesToUpload.length; start += BATCH_SIZE) {
    const slice = imagesToUpload.slice(start, start + BATCH_SIZE);
    await uploadBatch(slice);
    await sleep(1200);
  }

  console.log(`🖼️ [media] total mapped: ${Object.keys(imageMediaMap).length}/${imagesToUpload.length}`);
  return imageMediaMap;
};


//done with new version
const publishProductToSalesChannels = async (productGID) => {
  const publicationsQuery = `
    query {
      publications(first: 20) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  const pubResponse = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
    { query: publicationsQuery },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  const publications = pubResponse.data?.data?.publications?.edges || [];

  if (!publications.length) {
    console.warn("[⚠️] No sales channels found.");
    return;
  }

  const publishMutation = `
    mutation publishablePublish($id: ID!, $publicationId: ID!) {
      publishablePublish(id: $id, input: { publicationId: $publicationId }) {
        publishable {
          ... on Product {
            id
          }
          ... on Collection {
            id
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  for (const pub of publications) {
    if (pub.node.name === "Point of Sale") {
      console.log(`[⏭️ Skipped] ${pub.node.name}`);
      continue;
    }

    const publishVariables = {
      id: productGID,
      publicationId: pub.node.id
    };

    try {
      const publishResponse = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
        {
          query: publishMutation,
          variables: publishVariables
        },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      const errors = publishResponse.data?.data?.publishablePublish?.userErrors;
      if (errors?.length) {
        console.error(`[❌ Failed] ${pub.node.name}`, errors);
      } else {
        console.log(`[✅ Published] ${pub.node.name}`);
      }
    } catch (err) {
      console.error(`[💥 Error publishing to] ${pub.node.name}`, err.message);
    }
  }
};







//done with new version
const updateProduct = async (productId, product) => {
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Define variables
  const variables = {
    input: {
      id: `gid://shopify/Product/${productId}`, // Product ID now inside the input
      title: product.title,
      handle: product.handle,
      descriptionHtml: product.body_html,
      vendor: product.vendor,
      productType: product.product_type,
      tags: product.tags.split(','),
      status: product.status,
    },
  };

  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
      {
        query: mutation,
        variables,
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    
    const data = response.data?.data?.productUpdate;
    if (data?.userErrors?.length) {
      throw new Error(JSON.stringify(data.userErrors));
    }
   
    console.log(`Updated ${productId} Product SuccessFully`)
    return productId;

  } catch (err) {
    console.error("❌ Product Update Failed:", {
      title: product.title,
      error: err.message,
      stack: err.stack,
    });
    throw new Error(`Product update failed: ${err.message}`);
  }
};


//done with new version
const updateInventoryItemWeight = async (productId, productVariantId, weight) => {
  const mutation = `
   mutation productVariantsBulkUpdate(
  $productId: ID!,
  $variants: [ProductVariantsBulkInput!]!,
  $allowPartialUpdates: Boolean = false
) {
  productVariantsBulkUpdate(
    productId: $productId,
    variants: $variants,
    allowPartialUpdates: $allowPartialUpdates
  ) {
    productVariants {
      id
      inventoryItem {
        id
        measurement {
          weight {
            value
            unit
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

  const variables = {
    "productId": productId,
    "variants": [
      {
        "id": productVariantId,
        "inventoryItem": {
          "measurement": {
            "weight": {
              "value": parseFloat(weight),
              "unit": "POUNDS"
            }
          }
        }
      }
    ],
    "allowPartialUpdates": true
  };

  const response = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
    {
      query: mutation,
      variables
    },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  const errors = response.data?.data?.inventoryItemUpdate?.userErrors;

  if (errors?.length) {
    console.error(`[❌ Weight Update Error] ->`, errors);
  }
};


//done with new version
const getInventoryDetails = async (productGid) => {
  const query = `
        query GetInventoryInfo($id: ID!) {
          product(id: $id) {
            variants(first: 1) {
              edges {
                node {
                  id
                  inventoryItem {
                    id
                  }
                }
              }
            }
          }
          locations(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      `;
  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
      { query, variables: { id: productGid } },
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const productVariant = response.data.data?.product?.variants?.edges?.[0]?.node;
    const locationId = response.data.data?.locations?.edges?.[0]?.node?.id;
    if (!productVariant || !locationId) throw new Error('Missing variant or location');
    return {
      inventoryItemId: productVariant.inventoryItem.id,
      locationId,
      variantId: productVariant.id
    };
  } catch (err) {
    throw new Error(`Inventory detail fetch failed: ${err.message}`);
  }
};

//done with new version
const updateShopifyInventory = async (inventoryItemId, locationId, quantity) => {
  const mutation = `
        mutation InventorySet($input: InventorySetOnHandQuantitiesInput!) {
          inventorySetOnHandQuantities(input: $input) {
            userErrors {
              field
              message
            }
          }
        }
      `;

  const variables = {
    input: {
      setQuantities: [
        {
          inventoryItemId,
          locationId,
          quantity,
        }
      ],
      reason: "correction"
    }
  };

  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
      { query: mutation, variables },
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data.data;
    const errors = data?.inventorySetOnHandQuantities?.userErrors;
    if (errors?.length) {
      return { status: false, message: 'Inventory set failed', errors };
    }

    return {
      status: true,
      message: 'Inventory set successfully'
    };
  } catch (err) {
    return {
      status: false,
      message: 'Inventory set error',
      error: err.message
    };
  }
};

const norm = s => (s || "").toString().trim().toLowerCase();

const filenameFromUrl = (u) => {
  try {
    return new URL(u).pathname.split("/").pop() || "";
  } catch {
    return (u.split("?")[0] || "").split("/").pop() || "";
  }
};

const inferKind = ({ src, altText }) => {
  const alt = norm(altText);
  if (alt) {
    if (/^fm$/i.test(alt)) return "fm";
    if (/^(?:f|b|d|omf|omb|oms)_fl$/i.test(alt)) return alt.toLowerCase();
  }

  const file = filenameFromUrl(src);
  const base = file.replace(/\.[a-z0-9]+$/i, "");

  if (/(?:^|_)fm(?:_|$)/i.test(base)) return "fm";

  const m = base.match(/(?:^|_)(omf|omb|oms|f|b|d)_fl(?:_|$)/i);
  if (m) {
    const k = m[1].toLowerCase();
    return `${k}_fl`;
  }

  return null;
};

const addOrUpdateVariants = async (productId, newVariants) => {
  // const locationId = await getDefaultLocationId();
  const productGID = `gid://shopify/Product/${productId}`;

  const fetchShopifyMediaUrls = async (productId) => {
    const fetchQuery = `
      query GetProductImages($id: ID!) {
        product(id: $id) {
          media(first: 250) {
            edges {
              node {
                ... on MediaImage {
                  id
                  alt
                  image {
                    originalSrc
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
      { query: fetchQuery, variables: { id: `gid://shopify/Product/${productId}` } },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );


    const mediaEdges = response.data?.data?.product?.media?.edges || [];
    const imageEntries = mediaEdges.map(edge => {
      const node = edge.node;
      return {
        src: node?.image?.originalSrc,
        altText: node?.alt || "",
      };
    }).filter(entry => entry.src);
    return imageEntries;
  };

  const shopifyImageEntries = await fetchShopifyMediaUrls(productId);

  const toCreate = [];
  const toUpdate = [];

  // Step 2: Fetch existing variants and initialize existingVariantsMap
  const fetchVariantsQuery = `
    query GetVariants($id: ID!) {
      product(id: $id) {
        variants(first: 250) {
          edges {
            node {
              id
              sku
              price
              compareAtPrice
              barcode         
              inventoryItem {
                id
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const fetchResponse = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
    { query: fetchVariantsQuery, variables: { id: productGID } },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const existingVariants = fetchResponse.data.data.product.variants.edges.map(e => e.node);
  const existingVariantsMap = new Map();

  for (const v of existingVariants) {
    existingVariantsMap.set(v.sku, v);
  }

  for (const variant of newVariants) {
    const existing = existingVariantsMap.get(variant.sku);

    if (!existing) {
      toCreate.push(variant);
    } else {
      const option1 = existing.selectedOptions.find(o => o.name === "Size")?.value;
      const option2 = existing.selectedOptions.find(o => o.name === "Color")?.value;

      const isChanged =
        parseFloat(existing.price) !== parseFloat(variant.price) ||
        parseFloat(existing.compareAtPrice) !== parseFloat(variant.compareAtPrice) ||
        existing.barcode !== variant.barcode ||
        option1 !== variant.option1 ||
        option2 !== variant.option2;

      if (isChanged) {
        toUpdate.push({
          id: existing.id,
          sku: variant.sku,
          price: parseFloat(variant.price),
          compareAtPrice: parseFloat(variant.compareAtPrice) || null,
          barcode: variant.barcode,
          option1: variant.option1,
          option2: variant.option2,
          inventoryItemId: existing.inventoryItem.id,
          inventory_quantity: variant.inventory_quantity,
          weight: parseFloat(variant.weight),
          metafields: variant.metafields || [],
          variantImages: variant.variantImages || [],
        });
      }
    }
  }

  if (toUpdate.length) {
    const productVariantUpdateMutation = `
      mutation productVariantUpdate($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            sku
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const originalLocationId = await getInventoryDetails(productGID);
    for (const v of toUpdate) {
      const variables = {
        input: {
          id: v.id,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          barcode: v.barcode,
          options: [v.option1, v.option2],
          sku: v.sku,
          ...(v.imageSrc && { image: { src: v.imageSrc } }),
        },
      };

      const updateResponse = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-10/graphql.json`,
        { query: productVariantUpdateMutation, variables },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (v.weight !== undefined) {
        await updateInventoryItemWeight(productGID, v.id, v.weight);
        console.log(`[⚖️ Weight Updated] Variant ${v.sku} → ${v.weight} lbs`);
      }

      if (v.inventory_quantity !== undefined && v.inventoryItemId && originalLocationId.locationId) {
        await updateShopifyInventory(v.inventoryItemId, originalLocationId.locationId, v.inventory_quantity);
        console.log(`[📦 Inventory Updated] Variant ${v.sku} → Qty: ${v.inventory_quantity}`);
      }

      const metafields = [];

      const variantSpecificImages = shopifyImageEntries
        .filter(entry => (v.variantImages || []).some(img => img.altText === entry.altText))
        .map(entry => entry.src);

      if (variantSpecificImages.length) {
        metafields.push({
          ownerId: v.id,
          namespace: "custom",
          key: "variant_images",
          value: JSON.stringify(variantSpecificImages),
          type: "json",
        });

        const fmUrl = (function () {
          for (const src of variantSpecificImages) {
            const kind = inferKind({ src, altText: "" });
            if (kind === "fm") return src;
          }
          return "";
        })();

        metafields.push({
          ownerId: v.id,
          namespace: "custom",
          key: "swatch_image",
          value: fmUrl,
          type: "single_line_text_field",
        });
      }

      for (const mf of v.metafields || []) {
        metafields.push({
          ownerId: v.id,
          namespace: mf.namespace || "specs",
          key: mf.key,
          value: mf.value,
          type: mf.type || "json",
        });
      }

      if (metafields.length) {
        const metafieldsSetMutation = `
          mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields {
                key
                namespace
                value
                type
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const metafieldResponse = await axios.post(
          `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
          { query: metafieldsSetMutation, variables: { metafields } },
          {
            headers: {
              "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const mfErrors = metafieldResponse.data?.data?.metafieldsSet?.userErrors;
        if (mfErrors?.length) {
          console.error("[❌ Metafield Set Error (Update)]", v.sku, mfErrors);
        }

        console.log(`[📝 Metafields] ${metafields.length} set for variant ${v.sku}`);
      }
    }
  }

  return {
    created: toCreate.length,
    updated: toUpdate.length,
  };
};

const updateSSMappingWithShopifyData = async (productId, variants) => {
  try {
    const query = `
      query getVariants($id: ID!) {
        product(id: $id) {
          id
          title
          variants(first: 250) {
            edges {
              node {
                id
                sku
                inventoryItem {
                  id
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-04/graphql.json`,
      { query, variables: { id: `gid://shopify/Product/${productId}` } },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const variantEdges = response.data?.data?.product?.variants?.edges || [];

    if (variantEdges.length === 0) {
      console.log(`[⚠️] No variants found for product ${productId}`);
      return;
    }

    let updatedCount = 0;
    let styleIdForSyncJob = null;

    const bulkOps = [];

    for (const edge of variantEdges) {
      const variant = edge.node;
      const sku = variant.sku;
      const shopifyVariantId = variant.id.split("/").pop();
      const shopifyInventoryId = variant.inventoryItem?.id?.split("/").pop();

      if (!sku || !shopifyVariantId || !shopifyInventoryId) {
        console.warn(`[⚠️] Invalid variant data for SKU: ${sku}`);
        continue;
      }

      bulkOps.push({
        updateOne: {
          filter: { sku },
          update: {
            $set: {
              shopifyProductId: productId,
              shopifyVariantId,
              shopifyInventoryId,
              shopifyProductData: response.data.data.product,
              shopifyInventoryStatus: "success",
              shopifyDataUpdateStatus: "success",
            },
          },
          upsert: true,
        },
      });

      updatedCount++;
      styleIdForSyncJob = styleIdForSyncJob || productId;
    }

    if (bulkOps.length > 0) {
      await SSProductMapping.bulkWrite(bulkOps);
      console.log(`[✅ MongoDB Updated] ${updatedCount} variants mapped to Shopify.`);
    }

    if (updatedCount > 0 && styleIdForSyncJob) {
      const syncJob = await StyleIdSyncJob.findOne({ styleId: styleIdForSyncJob });

      if (syncJob) {
        await StyleIdSyncJob.updateOne(
          { styleId: styleIdForSyncJob },
          {
            $set: {
              status: "success",
              syncedProducts: updatedCount,
              lastAttemped: new Date(),
            },
          }
        );
        console.log(`[✅ StyleIdSyncJob] styleID ${styleIdForSyncJob} marked as 'success'.`);
      } else {
        // await StyleIdSyncJob.create({
        //   styleId: styleIdForSyncJob,
        //   status: "success",
        //   syncedProducts: updatedCount,
        //   lastAttemped: new Date(),
        // });
        console.log(`[✅ New Sync Job] styleID ${styleIdForSyncJob} created and marked as 'success' else condition.`);
      }
    }

  } catch (err) {
    console.error("[❌ MongoDB Mapping Update Failed]", err.message);
    if (styleIdForSyncJob) {
      await StyleIdSyncJob.updateOne(
        { styleId: styleIdForSyncJob },
        {
          $set: {
            status: "failed",
            error: err.message,
            lastAttemped: new Date(),
          },
        }
      );
      console.log(`[❌ StyleIdSyncJob] styleID ${styleIdForSyncJob} marked as 'failed' due to an error.`);
    }
  }
};

const markVariantAsFailedInSyncJob = async (styleId, sku, reason = "image attach failed") => {
  try {
    await SSProductMapping.updateOne(
      { sku },
      {
        $set: {
          shopifyInventoryStatus: "failed",
          shopifyDataUpdateStatus: "failed",
          error: reason,
          updatedAt: new Date(),
        },
      }
    );

    console.info(`[⚠️ Product Update] SKU ${sku} marked as failed`);
  } catch (err) {
    console.error(
      `❌ Failed to update product mapping for SKU ${sku}:`,
      err.message
    );
  }
};

exports.uploadToShopify = async (products) => {
  console.log(`📦 Starting uploadToShopify for ${products.length} products`);

  const uploadedProducts = [];
  const variantsToUpdate = [];

  for (const product of products) {
    try {
      const existingProductId = await findProductByHandle(product.handle);

      let productId;

      if (existingProductId) {
        console.log(`♻️ Updating product: ${product.title} (${product.handle})`);
        productId = await updateProduct(existingProductId, product);
      } else {
        console.log(`🆕 Creating product: ${product.title} (${product.handle})`);
        productId = await createProductGraphQL(product);
        const productGID = `gid://shopify/Product/${productId}`;
        await publishProductToSalesChannels(productGID);
      }

      await addOrUpdateVariants(productId, product.variants);

      uploadedProducts.push({
        id: productId,
        title: product.title,
        handle: product.handle,
      });

      variantsToUpdate.push(...product.variants);

    } catch (error) {
      console.error(`[❌ Failed] ${product.title} | ${error.message}`);
    }
  }

  if (variantsToUpdate.length > 0) {
    try {
      await updateSSMappingWithShopifyData(uploadedProducts[0].id, variantsToUpdate);
    } catch (error) {
      console.error("[❌ SS Mapping Update Failed]", error.message);
    }
  }

  return uploadedProducts;
};