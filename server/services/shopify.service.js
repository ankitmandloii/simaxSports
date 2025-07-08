const axios = require("axios");
const SSProductMapping = require("../model/SSProductMapping");











const getDefaultLocationId = async () => {
  try {
    const response = await axios.get(
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/locations.json`,
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
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
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


    return response.data.data?.productByHandle?.id?.split('/').pop();
  } catch (error) {
    console.error("Error finding product by handle:", error.message);
    return null;
  }
};
// -----

// Sleep utility to delay execution

// Replace this with your actual function to get the default location ID




const waitForMediaReady = async (productId, mediaId, maxAttempts = 10, interval = 2000) => {
  const query = `
    query GetMediaStatus($productId: ID!) {
      product(id: $productId) {
        media(first: 10) {
          edges {
            node {
              id
              status
            }
          }
        }
      }
    }
  `;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
      {
        query,
        variables: { productId },
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const mediaEdges = res.data.data.product.media.edges;
    const media = mediaEdges.find((e) => e.node.id === mediaId);

    if (media && media.node.status === "READY") {
      return true;
    }

    await new Promise((r) => setTimeout(r, interval));
  }

  return false;
};

const createProductGraphQL = async (product) => {
  const productCreateMutation = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          variants(first: 100) {
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

  try {
    const locationId = await getDefaultLocationId();

    const variants = product.variants.map((variant) => ({
      sku: variant.sku,
      price: variant.price,
      options: [variant.option1, variant.option2].filter(Boolean),
      inventoryQuantities: [
        {
          locationId: `gid://shopify/Location/${locationId}`,
          availableQuantity: parseInt(variant.inventory_quantity) || 0,
        },
      ],
      inventoryManagement:
        variant.inventory_management === "shopify" ? "SHOPIFY" : "NOT_MANAGED",
    }));

    const productCreateVariables = {
      input: {
        title: product.title,
        handle: product.handle,
        bodyHtml: product.body_html,
        vendor: product.vendor,
        productType: product.product_type,
        tags: product.tags.split(",").map((tag) => tag.trim()),
        options: product.options.map((opt) => opt.name),
        variants,
      },
    };

    // Step 1: Create Product
    const createResponse = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
      { query: productCreateMutation, variables: productCreateVariables },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const productData = createResponse.data.data.productCreate;
    if (!productData || productData.userErrors?.length) {
      throw new Error(
        productData.userErrors.map((e) => `${e.field}: ${e.message}`).join(", ")
      );
    }

    const productId = productData.product.id;
    const variantMap = {};
    productData.product.variants.edges.forEach((edge) => {
      variantMap[edge.node.sku] = edge.node.id;
    });

    const imageMediaMap = {}; // Cache to reuse uploaded media

    for (const variant of product.variants) {
      const sku = variant.sku;
      const imageUrl = variant.imageSrc;
      const variantId = variantMap[sku];

      if (!imageUrl || !variantId) {
        console.warn(`⚠️ Missing image or variant ID for SKU: ${sku}`);
        continue;
      }

      let mediaId;

      if (imageMediaMap[imageUrl]) {
        mediaId = imageMediaMap[imageUrl];
      } else {
        const mediaUploadVariables = {
          productId,
          media: [
            {
              alt: `${variant.option1 || ""} ${variant.option2 || ""}`.trim(),
              mediaContentType: "IMAGE",
              originalSource: imageUrl,
            },
          ],
        };

        const uploadRes = await axios.post(
          `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
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

        const media = uploadRes.data.data.productCreateMedia.media[0];
        mediaId = media?.id;

        if (!mediaId) {
          console.warn(`⚠️ Failed to upload media for SKU: ${sku}`);
          continue;
        }

        const ready = await waitForMediaReady(productId, mediaId);
        if (!ready) {
          console.warn(`⚠️ Media not ready in time for SKU: ${sku}`);
          continue;
        }

        imageMediaMap[imageUrl] = mediaId;
      }

      // Attach media to variant
      const appendMediaVariables = {
        productId,
        variantMedia: [
          {
            variantId,
            mediaIds: [mediaId],
          },
        ],
      };

      const appendRes = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
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

      const errors = appendRes.data.data.productVariantAppendMedia.userErrors;
      if (errors?.length) {
        console.warn(`⚠️ Could not attach media to variant ${sku}`, errors);
      } else {
        console.log(`✅ Media attached to variant ${sku}`);
      }
    }

    return productId.split("/").pop();
  } catch (err) {
    console.error("❌ Product Creation Failed:", {
      title: product.title,
      error: err.message,
      stack: err.stack,
    });
    throw new Error(`Product creation failed: ${err.message}`);
  }
};








// const createProductGraphQL = async (product) => {
//   console.log("------------prod creaateee", product);

//   const mutation = `
//     mutation productCreate($input: ProductInput!) {
//       productCreate(input: $input) {
//         product {
//           id
//           title
//           handle
//           variants(first: 5) {
//             edges {
//               node {
//                 id
//                 sku
//               }
//             }
//           }
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   try {
//     const locationId = await getDefaultLocationId();

//     // Format variants according to Shopify's GraphQL schema
//     const variants = product.variants.map(variant => ({
//       sku: variant.sku,
//       price: variant.price,
//       options: [
//         variant.option1,
//         variant.option2
//       ],
//       inventoryQuantities: [{
//         locationId: `gid://shopify/Location/${locationId}`,
//         availableQuantity: parseInt(variant.inventory_quantity) || 0
//       }],
//       inventoryManagement: variant.inventory_management === "shopify" ?
//         'SHOPIFY' : 'NOT_MANAGED'
//     }));
//     console.log("-----------variantsss", variants);
//     const variables = {
//       input: {
//         title: product.title,
//         handle: product.handle,
//         bodyHtml: product.body_html,
//         vendor: product.vendor,
//         productType: product.product_type,
//         tags: product.tags.split(','),
//         options: product.options.map(opt => opt.name),
//         variants: variants
//       }
//     };

//     const response = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       {
//         query: mutation,
//         variables,
//       },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.data.data) {
//       console.error("GraphQL Response Error:", response.data.errors);
//       throw new Error(response.data.errors?.[0]?.message || "Unknown GraphQL error");
//     }

//     const data = response.data.data.productCreate;
//     if (data.userErrors && data.userErrors.length) {
//       console.error("Product Create User Errors:", data.userErrors);
//       throw new Error(data.userErrors.map(e => `${e.field}: ${e.message}`).join(', '));
//     }

//     if (!data.product || !data.product.id) {
//       throw new Error("Product creation failed - no product ID returned");
//     }

//     return data.product.id.split('/').pop();
//   } catch (error) {
//     console.error("Product Creation Failed:", {
//       productTitle: product.title,
//       error: error.message,
//       stack: error.stack
//     });
//     throw new Error(`Failed to create product: ${error.message}`);
//   }
// };

const publishProductToSalesChannel = async (productGID) => {
  const publicationsQuery = `
    query {
      publications(first: 5) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  // Step 1: Get publication ID (like "Online Store")
  const pubResponse = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
    { query: publicationsQuery },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  const publications = pubResponse.data?.data?.publications?.edges || [];
  const onlineStore = publications.find(p => p.node.name === "Online Store");

  if (!onlineStore) {
    console.warn("[⚠️] Online Store publication ID not found.");
    return;
  }

  const publicationId = onlineStore.node.id;

  // Step 2: Publish product to that sales channel
  const publishMutation = `
    mutation publishToSalesChannel($input: PublishablePublishInput!) {
      publishablePublish(input: $input) {
        publishable {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const publishVariables = {
    input: {
      id: productGID, // Full GID required
      publicationIds: [publicationId]
    }
  };

  const publishResponse = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
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
    console.error("[❌ Publish Failed]", errors);
  } else {
    console.log("[✅ Product published to Online Store]");
  }
};



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

  const variables = {
    input: {
      id: `gid://shopify/Product/${productId}`,
      title: product.title,
      handle: product.handle,
      bodyHtml: product.body_html,
      vendor: product.vendor,
      productType: product.product_type,
      tags: product.tags.split(','),
    },
  };

  const response = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
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

  const data = response.data.data.productUpdate;
  if (data.userErrors.length) {
    throw new Error(JSON.stringify(data.userErrors));
  }

  return productId;
};



// const addOrUpdateVariants = async (productId, newVariants) => {

//   console.log("addOrUpdateVariants CALLED");

//   const locationId = await getDefaultLocationId();

//   // Step 1: Fetch existing variants
//   const fetchQuery = `
//     query GetVariants($id: ID!) {
//       product(id: $id) {
//         variants(first: 100) {
//           edges {
//             node {
//               id
//               sku
//             }
//           }
//         }
//       }
//     }
//   `;

//   const productGID = `gid://shopify/Product/${productId}`;
//   const fetchResponse = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//     {
//       query: fetchQuery,
//       variables: { id: productGID }
//     },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const existingVariants = fetchResponse.data.data.product.variants.edges.map(e => e.node);
//   const existingSKUs = new Set(existingVariants.map(v => v.sku));

//   const variantsToCreate = newVariants.filter(v => !existingSKUs.has(v.sku));

//   if (variantsToCreate.length === 0) {
//     console.log(`[ℹ️] No new variants to add.`);
//     return;
//   }

//   // Step 2: Bulk create only new SKUs
//   const mutation = `
//     mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//       productVariantsBulkCreate(productId: $productId, variants: $variants) {
//         productVariants {
//           id
//           title
//           sku
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   const formattedVariants = variantsToCreate.map((v) => ({
//     sku: v.sku,
//     price: parseFloat(v.price),
//     taxable: v.taxable ?? true,
//     optionValues: [
//       { name: "Size", value: v.option1 },
//       { name: "Color", value: v.option2 }
//     ],
//     inventoryQuantities: [
//       {
//         locationId: `gid://shopify/Location/${locationId}`,
//         availableQuantity: v.inventory_quantity ?? 0
//       }
//     ]
//   }));

//   const variables = {
//     productId: productGID,
//     variants: formattedVariants
//   };

//   const createResponse = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//     {
//       query: mutation,
//       variables
//     },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const errors = createResponse.data.data?.productVariantsBulkCreate?.userErrors;
//   if (errors?.length) {
//     console.error("[❌ Variant Upload Failed]", errors);
//     throw new Error(JSON.stringify(errors));
//   }

//   console.log(`[✅ Variant Upload Success] ${formattedVariants.length} new variants uploaded to product ${productId}`);
// };


// old
// const addOrUpdateVariants = async (productId, newVariants) => {
//   console.log("addOrUpdateVariants CALLED");

//   const locationId = await getDefaultLocationId();

//   // Step 1: Fetch existing variants
//   const fetchQuery = `
//     query GetVariants($id: ID!) {
//       product(id: $id) {
//         variants(first: 100) {
//           edges {
//             node {
//               id
//               sku
//               price
//               inventoryItem {
//                 id
//               }
//               selectedOptions {
//                 name
//                 value
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const productGID = `gid://shopify/Product/${productId}`;
//   const fetchResponse = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//     {
//       query: fetchQuery,
//       variables: { id: productGID }
//     },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const existingVariants = fetchResponse.data.data.product.variants.edges.map(e => e.node);
//   const existingVariantsMap = new Map();
//   for (const v of existingVariants) {
//     existingVariantsMap.set(v.sku, v);
//   }

//   const toCreate = [];
//   const toUpdate = [];

//   for (const variant of newVariants) {
//     const existing = existingVariantsMap.get(variant.sku);
//     if (!existing) {
//       toCreate.push(variant);
//     } else {
//       // Compare and update only if needed
//       const option1 = existing.selectedOptions.find(o => o.name === "Size")?.value;
//       const option2 = existing.selectedOptions.find(o => o.name === "Color")?.value;

//       const isChanged =
//         parseFloat(existing.price) !== parseFloat(variant.price) ||
//         option1 !== variant.option1 ||
//         option2 !== variant.option2;

//       if (isChanged) {
//         toUpdate.push({
//           id: existing.id,
//           sku: variant.sku,
//           price: parseFloat(variant.price),
//           option1: variant.option1,
//           option2: variant.option2,
//           inventoryItemId: existing.inventoryItem.id,
//           inventory_quantity: variant.inventory_quantity
//         });
//       }
//     }
//   }

//   // Step 2: Create new variants
//   if (toCreate.length) {
//     const mutation = `
//       mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//         productVariantsBulkCreate(productId: $productId, variants: $variants) {
//           productVariants {
//             id
//             title
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const formatted = toCreate.map(v => ({
//       sku: v.sku,
//       price: parseFloat(v.price),
//       optionValues: [
//         { name: "Size", value: v.option1 },
//         { name: "Color", value: v.option2 }
//       ],
//       inventoryQuantities: [
//         {
//           locationId: `gid://shopify/Location/${locationId}`,
//           availableQuantity: v.inventory_quantity ?? 0
//         }
//       ]
//     }));

//     const variables = {
//       productId: productGID,
//       variants: formatted
//     };

//     const response = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = response.data.data?.productVariantsBulkCreate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Creation Failed]", errors);
//       throw new Error(JSON.stringify(errors));
//     }

//     console.log(`[✅ Created ${toCreate.length} variants]`);
//   }

//   // Step 3: Update existing variants
//   for (const v of toUpdate) {
//     const mutation = `
//       mutation productVariantUpdate($input: ProductVariantInput!) {
//         productVariantUpdate(input: $input) {
//           productVariant {
//             id
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const variables = {
//       input: {
//         id: v.id,
//         price: v.price,
//         options: [v.option1, v.option2],
//         sku: v.sku
//       }
//     };

//     const updateResponse = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = updateResponse.data.data?.productVariantUpdate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Update Failed]", errors);
//     } else {
//       console.log(`[✅ Updated variant: ${v.sku}]`);
//     }

//     // Step 4: Update inventory (if needed)
//     if (v.inventory_quantity !== undefined) {
//       const inventoryMutation = `
//         mutation inventorySetOnHandQuantity($input: InventorySetOnHandQuantityInput!) {
//           inventorySetOnHandQuantity(input: $input) {
//             inventoryLevel {
//               id
//               available
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: inventoryMutation,
//           variables: {
//             input: {
//               inventoryItemId: v.inventoryItemId,
//               locationId: `gid://shopify/Location/${locationId}`,
//               availableQuantity: parseInt(v.inventory_quantity)
//             }
//           }
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );
//     }
//   }

//   return {
//     created: toCreate.length,
//     updated: toUpdate.length
//   };
// };



// const addOrUpdateVariants = async (productId, newVariants) => {
//   console.log("addOrUpdateVariants CALLED", newVariants);

//   const locationId = await getDefaultLocationId();

//   // Step 1: Fetch existing variants
//   const fetchQuery = `
//     query GetVariants($id: ID!) {
//       product(id: $id) {
//         variants(first: 100) {
//           edges {
//             node {
//               id
//               sku
//               price
//               inventoryItem {
//                 id
//               }
//               selectedOptions {
//                 name
//                 value
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const productGID = `gid://shopify/Product/${productId}`;
//   const fetchResponse = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//     {
//       query: fetchQuery,
//       variables: { id: productGID }
//     },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const existingVariants = fetchResponse.data.data.product.variants.edges.map(e => e.node);
//   const existingVariantsMap = new Map();
//   for (const v of existingVariants) {
//     existingVariantsMap.set(v.sku, v);
//   }

//   const toCreate = [];
//   const toUpdate = [];

//   for (const variant of newVariants) {
//     const existing = existingVariantsMap.get(variant.sku);
//     if (!existing) {
//       toCreate.push(variant);
//     } else {
//       const option1 = existing.selectedOptions.find(o => o.name === "Size")?.value;
//       const option2 = existing.selectedOptions.find(o => o.name === "Color")?.value;

//       const isChanged =
//         parseFloat(existing.price) !== parseFloat(variant.price) ||
//         option1 !== variant.option1 ||
//         option2 !== variant.option2;

//       if (isChanged) {
//         toUpdate.push({
//           id: existing.id,
//           sku: variant.sku,
//           price: parseFloat(variant.price),
//           option1: variant.option1,
//           option2: variant.option2,
//           inventoryItemId: existing.inventoryItem.id,
//           inventory_quantity: variant.inventory_quantity,
//           imageSrc: variant.imageSrc || null
//         });
//       }
//     }
//   }

//   // Step 2: Create new variants
//   if (toCreate.length) {
//     const mutation = `
//       mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//         productVariantsBulkCreate(productId: $productId, variants: $variants) {
//           productVariants {
//             id
//             title
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const formatted = toCreate.map(v => ({
//       sku: v.sku,
//       price: parseFloat(v.price),
//       optionValues: [
//         { name: "Size", value: v.option1 },
//         { name: "Color", value: v.option2 }
//       ],
//       inventoryQuantities: [
//         {
//           locationId: `gid://shopify/Location/${locationId}`,
//           availableQuantity: v.inventory_quantity ?? 0
//         }
//       ],
//       ...(v.imageSrc ? { image: { src: v.imageSrc } } : {})
//       // ...(v.imageSrc && { image: { src: v.imageSrc } })
//     }));

//     const variables = {
//       productId: productGID,
//       variants: formatted
//     };

//     const response = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = response.data.data?.productVariantsBulkCreate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Creation Failed]", errors);
//       throw new Error(JSON.stringify(errors));
//     }

//     console.log(`[✅ Created ${toCreate.length} variants]`);

//     // 👉 Step 2.1: Set metafields for created variants
//     const createdVariants = response.data.data?.productVariantsBulkCreate?.productVariants || [];
//     console.log("createdVarints", createdVariants)
//     const metafieldsSetMutation = `
//       mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
//         metafieldsSet(metafields: $metafields) {
//           metafields {
//             key
//             namespace
//             value
//             type
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     for (let i = 0; i < createdVariants.length; i++) {
//       const created = createdVariants[i];
//       const original = toCreate[i];

//       if (!original || !created?.id || !original.imageSrc) continue;

//       const metafieldVariables = {
//         metafields: [
//           {
//             ownerId: created?.id || v.id, // depending on whether it's create or update
//             namespace: "custom",
//             key: "variant_images",
//             value: JSON.stringify(original.variantImages || []),
//             type: "json"
//           }
//         ]
//       };
//       const metafieldResponse = await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: metafieldsSetMutation,
//           variables: metafieldVariables
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       const mfErrors = metafieldResponse.data?.data?.metafieldsSet?.userErrors;
//       if (mfErrors?.length) {
//         console.error("[❌ Metafield Set Error (Create)]", created.sku, mfErrors);
//       } else {
//         console.log(`[✅ Set metafield for variant: ${created.sku}]`);
//       }
//     }
//   }

//   // Step 3: Update existing variants
//   for (const v of toUpdate) {
//     const mutation = `
//       mutation productVariantUpdate($input: ProductVariantInput!) {
//         productVariantUpdate(input: $input) {
//           productVariant {
//             id
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const variables = {
//       input: {
//         id: v.id,
//         price: v.price,
//         options: [v.option1, v.option2],
//         sku: v.sku,
//         ...(v.imageSrc && { image: { src: v.imageSrc } })
//       }
//     };

//     const updateResponse = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = updateResponse.data.data?.productVariantUpdate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Update Failed]", errors);
//     } else {
//       console.log(`[✅ Updated variant: ${v.sku}]`);
//     }

//     // Step 3.1: Update metafield for updated variant
//     if (v.imageSrc) {
//       const metafieldsSetMutation = `
//         mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
//           metafieldsSet(metafields: $metafields) {
//             metafields {
//               key
//               namespace
//               value
//               type
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       const metafieldVariables = {
//         metafields: [
//           {
//             ownerId: created.id || v.id, // depending on whether it's create or update
//             namespace: "custom",
//             key: "variant_images",
//             value: JSON.stringify(v.variantImages || []),
//             type: "json"
//           }
//         ]
//       };
//       const metafieldResponse = await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: metafieldsSetMutation,
//           variables: metafieldVariables
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       const mfErrors = metafieldResponse.data?.data?.metafieldsSet?.userErrors;
//       if (mfErrors?.length) {
//         console.error("[❌ Metafield Set Error (Update)]", v.sku, mfErrors);
//       } else {
//         console.log(`[✅ Updated metafield for variant: ${v.sku}]`);
//       }
//     }

//     // Step 4: Update inventory (if needed)
//     if (v.inventory_quantity !== undefined) {
//       const inventoryMutation = `
//         mutation inventorySetOnHandQuantity($input: InventorySetOnHandQuantityInput!) {
//           inventorySetOnHandQuantity(input: $input) {
//             inventoryLevel {
//               id
//               available
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: inventoryMutation,
//           variables: {
//             input: {
//               inventoryItemId: v.inventoryItemId,
//               locationId: `gid://shopify/Location/${locationId}`,
//               availableQuantity: parseInt(v.inventory_quantity)
//             }
//           }
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );
//     }
//   }

//   return {
//     created: toCreate.length,
//     updated: toUpdate.length
//   };
// };



const updateInventoryItemWeight = async (inventoryItemId, weight) => {
  const mutation = `
    mutation inventoryItemUpdate($input: InventoryItemUpdateInput!) {
      inventoryItemUpdate(input: $input) {
        inventoryItem {
          id
          weight
          weightUnit
        }
        userErrors {
          field
          message
        }
      }
    }`;

  const variables = {
    input: {
      id: inventoryItemId,
      weight: parseFloat(weight),
      weightUnit: "POUNDS" // or "KILOGRAMS", "OUNCES", "GRAMS"
    }
  };

  const response = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
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
    console.error(`[❌ Weight Update Error] ${inventoryItemId}`, errors);
  } else {
    console.log(`[⚖️ Weight Updated] ${inventoryItemId} → ${weight} lb`);
  }
};


const addOrUpdateVariants = async (productId, newVariants) => {
  console.log("addOrUpdateVariants CALLED", newVariants);

  const locationId = await getDefaultLocationId();
  const productGID = `gid://shopify/Product/${productId}`;

  // Step 1: Fetch existing variants
  const fetchQuery = `
    query GetVariants($id: ID!) {
      product(id: $id) {
        variants(first: 100) {
          edges {
            node {
              id
              sku
              price
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
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
    {
      query: fetchQuery,
      variables: { id: productGID }
    },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  const existingVariants = fetchResponse.data.data.product.variants.edges.map(e => e.node);
  const existingVariantsMap = new Map();
  for (const v of existingVariants) {
    existingVariantsMap.set(v.sku, v);
  }

  const toCreate = [];
  const toUpdate = [];

  for (const variant of newVariants) {
    const existing = existingVariantsMap.get(variant.sku);
    if (!existing) {
      toCreate.push(variant);
    } else {
      const option1 = existing.selectedOptions.find(o => o.name === "Size")?.value;
      const option2 = existing.selectedOptions.find(o => o.name === "Color")?.value;

      const isChanged =
        parseFloat(existing.price) !== parseFloat(variant.price) ||
        option1 !== variant.option1 ||
        option2 !== variant.option2;

      if (isChanged) {
        toUpdate.push({
          id: existing.id,
          sku: variant.sku,
          price: parseFloat(variant.price),
          option1: variant.option1,
          option2: variant.option2,
          inventoryItemId: existing.inventoryItem.id,
          inventory_quantity: variant.inventory_quantity,
          imageSrc: variant.imageSrc || null,
          variantImages: variant.variantImages || [],
          weight: parseFloat(variant.weight || 0) // ✅ Add weight here
        });
      }
    }
  }

  // Step 2: Create new variants
  if (toCreate.length) {
    const mutation = `
      mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkCreate(productId: $productId, variants: $variants) {
          productVariants {
            id
            title
            sku
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const formatted = toCreate.map(v => ({
      sku: v.sku,
      price: parseFloat(v.price),
      optionValues: [
        { name: "Size", value: v.option1 },
        { name: "Color", value: v.option2 }
      ],
      inventoryQuantities: [
        {
          locationId: `gid://shopify/Location/${locationId}`,
          availableQuantity: v.inventory_quantity ?? 0
        }
      ],
      ...(v.imageSrc ? { image: { src: v.imageSrc } } : {}),
      weight: parseFloat(v.weight || 0),
      weightUnit: v.weight_unit || "lb"
    }));

    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
      { query: mutation, variables: { productId: productGID, variants: formatted } },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const errors = response.data.data?.productVariantsBulkCreate?.userErrors;
    if (errors?.length) {
      console.error("[❌ Variant Creation Failed]", errors);
      throw new Error(JSON.stringify(errors));
    }

    console.log(`[✅ Created ${toCreate.length} variants]`);

    const createdVariants = response.data.data?.productVariantsBulkCreate?.productVariants || [];
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

    for (let i = 0; i < createdVariants.length; i++) {
      const created = createdVariants[i];
      const original = toCreate[i];

      if (!original || !created?.id || !original.variantImages?.length) continue;

      const metafieldVariables = {
        metafields: [
          {
            ownerId: created.id,
            namespace: "custom",
            key: "variant_images",
            value: JSON.stringify(original.variantImages || []),
            type: "json"
          }
        ]
      };

      const metafieldResponse = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
        {
          query: metafieldsSetMutation,
          variables: metafieldVariables
        },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      const mfErrors = metafieldResponse.data?.data?.metafieldsSet?.userErrors;
      if (mfErrors?.length) {
        console.error("[❌ Metafield Set Error (Create)]", created.sku, mfErrors);
      } else {
        console.log(`[✅ Set metafield for variant: ${created.sku}]`);
      }
    }
  }

  // Step 3: Update existing variants
  for (const v of toUpdate) {
    const mutation = `
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

    const variables = {
      input: {
        id: v.id,
        price: v.price,
        options: [v.option1, v.option2],
        sku: v.sku,
        ...(v.imageSrc && { image: { src: v.imageSrc } })
      }
    };

    const updateResponse = await axios.post(
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
      { query: mutation, variables },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const errors = updateResponse.data.data?.productVariantUpdate?.userErrors;
    if (errors?.length) {
      console.error("[❌ Variant Update Failed]", errors);
    } else {
      console.log(`[✅ Updated variant: ${v.sku}]`);
    }

    // ✅ Step 3.1: Update InventoryItem weight
    if (v.weight !== undefined && v.inventoryItemId) {
      await updateInventoryItemWeight(v.inventoryItemId, v.weight);
    }

    // ✅ Step 3.2: Update variant metafields
    if (v.variantImages?.length) {
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

      const metafieldVariables = {
        metafields: [
          {
            ownerId: v.id,
            namespace: "custom",
            key: "variant_images",
            value: JSON.stringify(v.variantImages),
            type: "json"
          }
        ]
      };

      const metafieldResponse = await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
        {
          query: metafieldsSetMutation,
          variables: metafieldVariables
        },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      const mfErrors = metafieldResponse.data?.data?.metafieldsSet?.userErrors;
      if (mfErrors?.length) {
        console.error("[❌ Metafield Set Error (Update)]", v.sku, mfErrors);
      } else {
        console.log(`[✅ Updated metafield for variant: ${v.sku}]`);
      }
    }

    // ✅ Step 4: Update inventory
    if (v.inventory_quantity !== undefined) {
      const inventoryMutation = `
        mutation inventorySetOnHandQuantity($input: InventorySetOnHandQuantityInput!) {
          inventorySetOnHandQuantity(input: $input) {
            inventoryLevel {
              id
              available
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      await axios.post(
        `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
        {
          query: inventoryMutation,
          variables: {
            input: {
              inventoryItemId: v.inventoryItemId,
              locationId: `gid://shopify/Location/${locationId}`,
              availableQuantity: parseInt(v.inventory_quantity)
            }
          }
        },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }

  return {
    created: toCreate.length,
    updated: toUpdate.length
  };
};

// const addOrUpdateVariants = async (productId, newVariants) => {
//   console.log("addOrUpdateVariants CALLED", newVariants);

//   const locationId = await getDefaultLocationId();
//   const productGID = `gid://shopify/Product/${productId}`;

//   // Step 1: Fetch existing variants
//   const fetchQuery = `
//     query GetVariants($id: ID!) {
//       product(id: $id) {
//         variants(first: 100) {
//           edges {
//             node {
//               id
//               sku
//               price
//               inventoryItem {
//                 id
//               }
//               selectedOptions {
//                 name
//                 value
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const fetchResponse = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//     {
//       query: fetchQuery,
//       variables: { id: productGID }
//     },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const existingVariants = fetchResponse.data.data.product.variants.edges.map(e => e.node);
//   const existingVariantsMap = new Map();
//   for (const v of existingVariants) {
//     existingVariantsMap.set(v.sku, v);
//   }

//   const toCreate = [];
//   const toUpdate = [];

//   for (const variant of newVariants) {
//     const existing = existingVariantsMap.get(variant.sku);
//     if (!existing) {
//       toCreate.push(variant);
//     } else {
//       const option1 = existing.selectedOptions.find(o => o.name === "Size")?.value;
//       const option2 = existing.selectedOptions.find(o => o.name === "Color")?.value;

//       const isChanged =
//         parseFloat(existing.price) !== parseFloat(variant.price) ||
//         option1 !== variant.option1 ||
//         option2 !== variant.option2;

//       if (isChanged) {
//         toUpdate.push({
//           id: existing.id,
//           sku: variant.sku,
//           price: parseFloat(variant.price),
//           option1: variant.option1,
//           option2: variant.option2,
//           inventoryItemId: existing.inventoryItem.id,
//           inventory_quantity: variant.inventory_quantity,
//           imageSrc: variant.imageSrc || null,
//           variantImages: variant.variantImages || []
//         });
//       }
//     }
//   }

//   // Step 2: Create new variants
//   if (toCreate.length) {
//     const mutation = `
//       mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//         productVariantsBulkCreate(productId: $productId, variants: $variants) {
//           productVariants {
//             id
//             title
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const formatted = toCreate.map(v => ({
//       sku: v.sku,
//       price: parseFloat(v.price),
//       optionValues: [
//         { name: "Size", value: v.option1 },
//         { name: "Color", value: v.option2 }
//       ],
//       inventoryQuantities: [
//         {
//           locationId: `gid://shopify/Location/${locationId}`,
//           availableQuantity: v.inventory_quantity ?? 0
//         }
//       ],
//       ...(v.imageSrc ? { image: { src: v.imageSrc } } : {}),
//       weight: parseFloat(v.weight || 0),
//       weightUnit: v.weight_unit || "lb"
//     }));

//     const response = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables: { productId: productGID, variants: formatted } },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = response.data.data?.productVariantsBulkCreate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Creation Failed]", errors);
//       throw new Error(JSON.stringify(errors));
//     }

//     console.log(`[✅ Created ${toCreate.length} variants]`);

//     // Set metafields for created variants
//     const createdVariants = response.data.data?.productVariantsBulkCreate?.productVariants || [];
//     const metafieldsSetMutation = `
//       mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
//         metafieldsSet(metafields: $metafields) {
//           metafields {
//             key
//             namespace
//             value
//             type
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     for (let i = 0; i < createdVariants.length; i++) {
//       const created = createdVariants[i];
//       const original = toCreate[i];

//       if (!original || !created?.id || !original.variantImages?.length) continue;

//       const metafieldVariables = {
//         metafields: [
//           {
//             ownerId: created.id,
//             namespace: "custom",
//             key: "variant_images",
//             value: JSON.stringify(original.variantImages || []),
//             type: "json"
//           }
//         ]
//       };

//       const metafieldResponse = await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: metafieldsSetMutation,
//           variables: metafieldVariables
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       const mfErrors = metafieldResponse.data?.data?.metafieldsSet?.userErrors;
//       if (mfErrors?.length) {
//         console.error("[❌ Metafield Set Error (Create)]", created.sku, mfErrors);
//       } else {
//         console.log(`[✅ Set metafield for variant: ${created.sku}]`);
//       }
//     }
//   }

//   // Step 3: Update existing variants
//   for (const v of toUpdate) {
//     const mutation = `
//       mutation productVariantUpdate($input: ProductVariantInput!) {
//         productVariantUpdate(input: $input) {
//           productVariant {
//             id
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const variables = {
//       input: {
//         id: v.id,
//         price: v.price,
//         options: [v.option1, v.option2],
//         sku: v.sku,
//         ...(v.imageSrc && { image: { src: v.imageSrc } }),
//         ...(v.weight !== undefined && {
//           weight: parseFloat(v.weight),
//           weightUnit: v.weight_unit || "lb"
//         })
//       }
//     };

//     const updateResponse = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = updateResponse.data.data?.productVariantUpdate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Update Failed]", errors);
//     } else {
//       console.log(`[✅ Updated variant: ${v.sku}]`);
//     }

//     // Step 3.1: Update variant metafields
//     if (v.variantImages?.length) {
//       const metafieldsSetMutation = `
//         mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
//           metafieldsSet(metafields: $metafields) {
//             metafields {
//               key
//               namespace
//               value
//               type
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       const metafieldVariables = {
//         metafields: [
//           {
//             ownerId: v.id,
//             namespace: "custom",
//             key: "variant_images",
//             value: JSON.stringify(v.variantImages),
//             type: "json"
//           }
//         ]
//       };

//       const metafieldResponse = await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: metafieldsSetMutation,
//           variables: metafieldVariables
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       const mfErrors = metafieldResponse.data?.data?.metafieldsSet?.userErrors;
//       if (mfErrors?.length) {
//         console.error("[❌ Metafield Set Error (Update)]", v.sku, mfErrors);
//       } else {
//         console.log(`[✅ Updated metafield for variant: ${v.sku}]`);
//       }
//     }

//     // Step 4: Update inventory
//     if (v.inventory_quantity !== undefined) {
//       const inventoryMutation = `
//         mutation inventorySetOnHandQuantity($input: InventorySetOnHandQuantityInput!) {
//           inventorySetOnHandQuantity(input: $input) {
//             inventoryLevel {
//               id
//               available
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: inventoryMutation,
//           variables: {
//             input: {
//               inventoryItemId: v.inventoryItemId,
//               locationId: `gid://shopify/Location/${locationId}`,
//               availableQuantity: parseInt(v.inventory_quantity)
//             }
//           }
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );
//     }
//   }

//   return {
//     created: toCreate.length,
//     updated: toUpdate.length
//   };
// };

// const addOrUpdateVariants = async (productId, newVariants) => {
//   console.log("addOrUpdateVariants CALLED");

//   const locationId = await getDefaultLocationId();

//   // Step 1: Fetch existing variants
//   const fetchQuery = `
//     query GetVariants($id: ID!) {
//       product(id: $id) {
//         variants(first: 100) {
//           edges {
//             node {
//               id
//               sku
//               price
//               inventoryItem {
//                 id
//               }
//               selectedOptions {
//                 name
//                 value
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const productGID = `gid://shopify/Product/${productId}`;
//   const fetchResponse = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//     {
//       query: fetchQuery,
//       variables: { id: productGID }
//     },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const existingVariants = fetchResponse.data.data.product.variants.edges.map(e => e.node);
//   const existingVariantsMap = new Map();
//   for (const v of existingVariants) {
//     existingVariantsMap.set(v.sku, v);
//   }

//   const toCreate = [];
//   const toUpdate = [];

//   for (const variant of newVariants) {
//     const existing = existingVariantsMap.get(variant.sku);
//     if (!existing) {
//       toCreate.push(variant);
//     } else {
//       // Compare and update only if needed
//       const option1 = existing.selectedOptions.find(o => o.name === "Size")?.value;
//       const option2 = existing.selectedOptions.find(o => o.name === "Color")?.value;

//       const isChanged =
//         parseFloat(existing.price) !== parseFloat(variant.price) ||
//         option1 !== variant.option1 ||
//         option2 !== variant.option2;

//       if (isChanged) {
//         toUpdate.push({
//           id: existing.id,
//           sku: variant.sku,
//           price: parseFloat(variant.price),
//           option1: variant.option1,
//           option2: variant.option2,
//           inventoryItemId: existing.inventoryItem.id,
//           inventory_quantity: variant.inventory_quantity,
//           imageSrc: variant.imageSrc || null
//         });
//       }
//     }
//   }

//   // Step 2: Create new variants
//   if (toCreate.length) {
//     const mutation = `
//       mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//         productVariantsBulkCreate(productId: $productId, variants: $variants) {
//           productVariants {
//             id
//             title
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const formatted = toCreate.map(v => ({
//       sku: v.sku,
//       price: parseFloat(v.price),
//       optionValues: [
//         { name: "Size", value: v.option1 },
//         { name: "Color", value: v.option2 }
//       ],
//       inventoryQuantities: [
//         {
//           locationId: `gid://shopify/Location/${locationId}`,
//           availableQuantity: v.inventory_quantity ?? 0
//         }
//       ],
//        ...(v.imageSrc ? { image: { src: v.imageSrc } } : {})
//       // ...(v.imageSrc && { image: { src: v.imageSrc } })
//     }));

//     const variables = {
//       productId: productGID,
//       variants: formatted
//     };

//     const response = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = response.data.data?.productVariantsBulkCreate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Creation Failed]", errors);
//       throw new Error(JSON.stringify(errors));
//     }

//     console.log(`[✅ Created ${toCreate.length} variants]`);
//   }

//   // Step 3: Update existing variants
//   for (const v of toUpdate) {
//     const mutation = `
//       mutation productVariantUpdate($input: ProductVariantInput!) {
//         productVariantUpdate(input: $input) {
//           productVariant {
//             id
//             sku
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `;

//     const variables = {
//       input: {
//         id: v.id,
//         price: v.price,
//         options: [v.option1, v.option2],
//         sku: v.sku,
//         ...(v.imageSrc && { image: { src: v.imageSrc } })
//       }
//     };

//     const updateResponse = await axios.post(
//       `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//       { query: mutation, variables },
//       {
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const errors = updateResponse.data.data?.productVariantUpdate?.userErrors;
//     if (errors?.length) {
//       console.error("[❌ Variant Update Failed]", errors);
//     } else {
//       console.log(`[✅ Updated variant: ${v.sku}]`);
//     }

//     // Step 4: Update inventory (if needed)
//     if (v.inventory_quantity !== undefined) {
//       const inventoryMutation = `
//         mutation inventorySetOnHandQuantity($input: InventorySetOnHandQuantityInput!) {
//           inventorySetOnHandQuantity(input: $input) {
//             inventoryLevel {
//               id
//               available
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       await axios.post(
//         `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//         {
//           query: inventoryMutation,
//           variables: {
//             input: {
//               inventoryItemId: v.inventoryItemId,
//               locationId: `gid://shopify/Location/${locationId}`,
//               availableQuantity: parseInt(v.inventory_quantity)
//             }
//           }
//         },
//         {
//           headers: {
//             "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//             "Content-Type": "application/json"
//           }
//         }
//       );
//     }
//   }

//   return {
//     created: toCreate.length,
//     updated: toUpdate.length
//   };
// };

const addProductImagesIfNotExists = async (productId, images) => {
  console.log("addProductImagesIfNotExists CALLED");

  // Step 1: Fetch current images
  const query = `
    query GetProductImages($id: ID!) {
      product(id: $id) {
        media(first: 100) {
          edges {
            node {
              ... on MediaImage {
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

  const productGID = `gid://shopify/Product/${productId}`;
  const fetchResponse = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
    {
      query,
      variables: { id: productGID }
    },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  const existingImageSrcs = new Set(
    fetchResponse.data.data.product.media.edges
      .map(e => e.node?.image?.originalSrc)
      .filter(Boolean)
  );

  const imagesToAdd = images.filter(img => !existingImageSrcs.has(img.src));

  if (imagesToAdd.length === 0) {
    console.log(`[ℹ️] No new images to upload.`);
    return;
  }

  const mutation = `
    mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;


  const variables = {
    productId: productGID,
    media: imagesToAdd.map(img => ({
      originalSource: `${img.src}`,
      alt: img.altText || `Product image for ${productId}`,
      mediaContentType: "IMAGE"
    }))
  };



  const response = await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
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

  const errors = response.data.data?.productCreateMedia?.userErrors;

  if (errors?.length) {
    console.error("[❌ Image Upload Failed]", errors);
    throw new Error(JSON.stringify(errors));
  }

  console.log(`[✅ Image Upload Success] ${imagesToAdd.length} images uploaded to product ${productId}`);
};


// const addProductImages = async (productId, images) => {
//    console.log("addProductImages CALLED")
//   const mutation = `
//     mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
//       productCreateMedia(productId: $productId, media: $media) {
//         media {
//           id
//           ... on MediaImage {
//             image {
//               originalSrc
//             }
//           }
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   const variables = {
//     productId: `gid://shopify/Product/${productId}`,
//     media: images.map(img => ({
//       originalSource: img.src,
//       alt: img.altText || `Product image for ${productId}`
//     }))
//   };

//   const response = await axios.post(
//     `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
//     {
//       query: mutation,
//       variables
//     },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const errors = response.data.data?.productCreateMedia?.userErrors;
//   if (errors?.length) {
//     console.error("[❌ Image Upload Failed]", errors);
//     throw new Error(JSON.stringify(errors));
//   }

//   console.log(`[✅ Image Upload Success] ${images.length} images uploaded to product ${productId}`);
// };

// exports.uploadToShopify = async (products) => {

//   const uploadedProducts = [];

//   for (const product of products) {
//     try {
//       // First check if product exists
//       console.log(product.handle, "handle In UPloaddddddddddddddddddddd");
//       const existingProductId = await findProductByHandle(product.handle);
//       console.log(existingProductId,"existingProduct1111111111");
//       let productId;
//       if (existingProductId) {
//         console.log(`[ℹ️ Updating] ${product.title}`);
//         productId = await updateProduct(existingProductId, product);
//       } else {
//         console.log(`[➕ Creating] ${product.title}`);
//         productId = await createProductGraphQL(product);
//       }

//       // Add/update variants
//       await addVariants(productId, product.variants);

//       // Add images if they don't exist
//       if (product.images.length > 0) {
//         await addProductImages(productId, product.images);
//       }

//       uploadedProducts.push({
//         id: productId,
//         title: product.title,
//         handle: product.handle
//       });

//       console.log(`[✅ Success] ${product.title}`);
//     } catch (error) {
//       console.error(`[❌ Failed] ${product.title} | ${error.message}`);
//     }
//   }

//   return uploadedProducts;
// };

//old




const updateSSMappingWithShopifyData = async (productId, variants) => {
  try {
    const query = `
      query getVariants($id: ID!) {
        product(id: $id) {
          id
          title
          variants(first: 100) {
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
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
      {
        query,
        variables: { id: `gid://shopify/Product/${productId}` }
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const variantEdges = response.data?.data?.product?.variants?.edges || [];

    for (const edge of variantEdges) {
      const variant = edge.node;
      const sku = variant.sku;
      const shopifyVariantId = variant.id.split("/").pop();
      const shopifyInventoryId = variant.inventoryItem?.id?.split("/").pop();

      await SSProductMapping.updateOne(
        { sku: sku },
        {
          $set: {
            shopifyProductId: productId,
            shopifyVariantId: shopifyVariantId,
            shopifyInventoryId: shopifyInventoryId,
            shopifyProductData: response.data.data.product,
            shopifyInventoryStatus: "synced",
            shopifyDataUpdateStatus: "success"
          }
        }
      );
    }

    console.log(`[✅ MongoDB Updated] ${variantEdges.length} variants mapped to Shopify.`);
  } catch (err) {
    console.error("[❌ MongoDB Mapping Update Failed]", err.message);
  }
};



const setProductMetafields = async (productGID, metafields) => {
  const mutation = `
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

  const variables = {
    metafields: metafields.map(mf => ({
      ownerId: productGID,
      namespace: mf.namespace,
      key: mf.key,
      type: mf.type,
      value: mf.value
    }))
  };

  await axios.post(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
    {
      query: mutation,
      variables
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
      }
    }
  );
};

// exports.uploadToShopify = async (products) => {
//   // console.log("----------productssss", products);
//   const uploadedProducts = [];

//   for (const product of products) {
//     try {
//       // console.log(`[🧾 Handle] ${product.handle}`);
//       const existingProductId = await findProductByHandle(product.handle);
//       let productId;

//       if (existingProductId) {
//         // console.log(`[🔄 Updating] ${product.title}`);
//         productId = await updateProduct(existingProductId, product);
//       } else {
//         // console.log(`[🆕 Creating] ${product.title}`);
//         productId = await createProductGraphQL(product);
//         const productGID = `gid://shopify/Product/${productId}`;
//         await publishProductToSalesChannel(productGID);

//         if (product.metafields && product.metafields.length > 0) {
//           await setProductMetafields(productGID, product.metafields);
//         }
//       }

//       // Prevent duplicate images
//       if (product.images.length > 0) {
//         // console.log("product.images length for upload", product.images.length);
//         await addProductImagesIfNotExists(productId, product.images); // Avoid duplication
//       }

//       // Update or add variants
//       await addOrUpdateVariants(productId, product.variants); // New version that handles update vs add


//       console.log("product.images length for upload", product.images);
//       await addProductImagesIfNotExists(productId, product.images); // Avoid duplication


//       uploadedProducts.push({
//         id: productId,
//         title: product.title,
//         handle: product.handle,
//       });

//       await updateSSMappingWithShopifyData(productId, product.variants);
//       // console.log(`[✅ Synced] ${product.title}`);
//     } catch (error) {
//       // console.error(`[❌ Failed] ${product.title} | ${error.message}`);
//     }
//   }

//   return uploadedProducts;
// };

exports.uploadToShopify = async (products) => {
  const uploadedProducts = [];

  for (const product of products) {
    try {
      const existingProductId = await findProductByHandle(product.handle);
      let productId;

      if (existingProductId) {
        productId = await updateProduct(existingProductId, product);
      } else {
        productId = await createProductGraphQL(product);
        const productGID = `gid://shopify/Product/${productId}`;
        await publishProductToSalesChannel(productGID);

        // ✅ Removed product-level metafields
      }

      // Prevent duplicate images
      if (product.images.length > 0) {
        await addProductImagesIfNotExists(productId, product.images);
      }

      // ✅ This now handles variant creation + metafields
      await addOrUpdateVariants(productId, product.variants);

      uploadedProducts.push({
        id: productId,
        title: product.title,
        handle: product.handle,
      });

      await updateSSMappingWithShopifyData(productId, product.variants);

    } catch (error) {
      console.error(`[❌ Failed] ${product.title} | ${error.message}`);
    }
  }

  return uploadedProducts;
};
