

// export async function getProductsList(limit, cursor = null) {


//   const SHOPIFY_API_URL = `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-04/graphql.json`;

//   const afterClause = cursor ? `, after: "${cursor}"` : "";

//   const query = `{
//     products(first: ${limit}${afterClause}) {
//       pageInfo {
//         startCursor
//         endCursor
//         hasNextPage
//         hasPreviousPage
//       }
//       edges {
//         cursor
//         node {
//           id
//           title
//           variants(first: 250) {
//             edges {
//               node {
//                 id
//                 title
//                 price
//                 compareAtPrice
//                 sku
//                 image {
//                   originalSrc
//                 }
//                 selectedOptions {
//                   name
//                   value
//                 }

//                 metafields(first: 50, namespace: "custom") {
//                   edges {
//                     node {
//                       key
//                       namespace
//                       value
//                       type
//                     }
//                   }
//                 }
//               }
//             }
//             pageInfo {
//               hasNextPage
//             }
//           }
//           images(first: 50) {
//             edges {
//               node {
//                 originalSrc
//               }
//             }
//           }
//         }
//       }
//     }
//   }`;

//   try {
//     const response = await fetch(SHOPIFY_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
//       },
//       body: JSON.stringify({ query }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Failed to fetch products:', error);
//     throw new Error('Error fetching products from Shopify');
//   }
// }



// exports.getProductFilter = async (title, limit, isCursor) => {
//   const S_STORE = `${process.env.SHOPIFY_STORE_URL}`;
//   const A_TOKEN = `${process.env.SHOPIFY_API_KEY}`;

//   const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;
//   try {


//     // const query = `{
//     //   search(query: "${title}", first: ${limit} types: PRODUCT) {
//     //     edges {
//     //       node {
//     //         ... on Product {
//     //           options(first: 50) {
//     //             id
//     //             name
//     //             values
//     //           }
//     //           collections(first: 250) {
//     //             edges {
//     //               node {
//     //                 description
//     //                 descriptionHtml
//     //                 handle
//     //                 id
//     //                 updatedAt
//     //                 title
//     //               }
//     //             }
//     //           }
//     //           id
//     //           handle
//     //           variants(first: 3) {
//     //             edges {
//     //               node {
//     //                 priceV2 {
//     //                   amount
//     //                   currencyCode
//     //                 }
//     //                 title
//     //                 image {
//     //                   altText
//     //                   originalSrc
//     //                   id
//     //                 }
//     //                 compareAtPriceV2 {
//     //                   amount
//     //                   currencyCode
//     //                 }
//     //                 weightUnit
//     //                 weight
//     //                 availableForSale
//     //                 sku
//     //                 requiresShipping
//     //                 id
//     //                 quantityAvailable
//     //               }
//     //             }
//     //           }
//     //           onlineStoreUrl
//     //           productType
//     //           publishedAt
//     //           tags
//     //           updatedAt
//     //           vendor
//     //           title
//     //           availableForSale
//     //           createdAt
//     //           description
//     //           descriptionHtml
//     //           images(first: 250) {
//     //             edges {
//     //               node {
//     //                 altText
//     //                 id
//     //                 originalSrc
//     //               }
//     //             }
//     //           }
//     //         }
//     //       }
//     //     }
//     //     pageInfo {
//     //       startCursor
//     //       endCursor
//     //       hasNextPage
//     //       hasPreviousPage
//     //     }
//     //   }
//     // }`;
//     const query = `{
//   products(${args.join(", ")}) {
//     pageInfo {
//       startCursor
//       endCursor
//       hasNextPage
//       hasPreviousPage
//     }
//     edges {
//       cursor
//       node {
//         id
//         title
//         variants(first: 250) {
//           edges {
//             node {
//               id
//               title
//               image {
//                 originalSrc
//               }
//               selectedOptions {
//                 name
//                 value
//               }
//             }
//           }
//           pageInfo {
//             hasNextPage
//           }
//         }
//         images(first: 10) {
//           edges {
//             node {
//               originalSrc
//             }
//           }
//         }
//       }
//     }
//   }
// }`;
//     const response = await axios.post(
//       SHOPIFY_API_URL,
//       { query },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': A_TOKEN,
//         },
//       }
//     );

//     return response.data;

//   } catch (error) {
//     console.error('Failed to fetch products:', error);
//   }
// };


export async function getProductsList(limit = 5, cursor = null) {
  const SHOPIFY_API_URL = `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2025-04/graphql.json`;
  // const SHOPIFY_API_URL = `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
  const afterClause = cursor ? `, after: "${cursor}"` : "";

  const query = `{
    products(first: ${limit}${afterClause}) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          title
          tags
          variants(first: 200) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                sku
                image {
                        altText
                        id
                        originalSrc
                      }
                selectedOptions {
                  name
                  value
                }
                inventoryItem {
                  id
                  inventoryLevels(first: 1) {
                    edges {
                      node {
                        quantities(names: "available") {
                          name
                          quantity
                        }
                        location {
                          name
                        }
                      }
                    }
                  }
                }
                metafields(first: 10, namespace: "custom") {
                  edges {
                    node {
                      key
                      namespace
                      value
                      type
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Error fetching products from Shopify');
  }
}


export async function getProductsByCollectionId(limit, collectionId, cursor) {

  const S_STORE = `${process.env.SHOPIFY_STORE_URL}`;
  const A_TOKEN = `${process.env.SHOPIFY_API_KEY}`;

  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;
  // const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
  try {
    const isCursor = cursor ? `, after: "${cursor}"` : "";

    const query = `{
      node(id: "gid://shopify/Collection/${collectionId}") {
        ... on Collection {
          id
          title
          products(first: ${limit}${isCursor}) {
            pageInfo {
              hasNextPage
              endCursor
              startCursor
              hasPreviousPage
            }
            edges {
              cursor
              node {
                id
                title
                handle
                tags
                variants(first: 200) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                sku
                image {
                        altText
                        id
                        originalSrc
                      }
                selectedOptions {
                  name
                  value
                }
                inventoryItem {
                  id
                  inventoryLevels(first: 1) {
                    edges {
                      node {
                        quantities(names: "available") {
                          name
                          quantity
                        }
                        location {
                          name
                        }
                      }
                    }
                  }
                }
                metafields(first: 10, namespace: "custom") {
                  edges {
                    node {
                      key
                      namespace
                      value
                      type
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
                images(first: 5) {
                  edges {
                    node {
                      originalSrc
                      altText
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': A_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.data;

  } catch (error) {
    console.error("Failed to fetch Products:", error.message || error);
    return null;
  }
}

export async function getAllCollectionList(limit = 50, cursor = null) {
  const S_STORE = `${process.env.SHOPIFY_STORE_URL}`;
  const A_TOKEN = `${process.env.SHOPIFY_API_KEY}`;

  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;
  // const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
  try {
    const afterCursor = cursor ? `, after: "${cursor}"` : "";

    const query = `{
      collections(first: ${limit}${afterCursor}) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            title
            description
            descriptionHtml
            handle
            id
            updatedAt
            image {
              altText
              id
              originalSrc
            }
            products(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }`;

    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': A_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data.collections;

    // Filter out collections that have 0 products
    const collections = data.edges
      .filter(edge => edge.node.products.edges.length > 0)
      .map(edge => edge.node);

    return {
      collections,
      pageInfo: data.pageInfo,
      cursors: data.edges.map(edge => edge.cursor),
    };
  } catch (error) {
    console.error("Failed to fetch collections:", error.message || error);
    throw new Error("Error fetching collections");
  }
}



// services/products.js
export async function searchProducts({ q, limit, cursor, collectionId }) {
  const S_STORE = process.env.SHOPIFY_STORE_URL;
  const A_TOKEN = process.env.SHOPIFY_API_KEY;
  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;

  // Build Shopify search string
  const escaped = q.replace(/"/g, '\\"').trim();

  const parts = [];
  if (collectionId) {
    // Shopify's "collection_id:" needs the numeric id
    const numericId = String(collectionId).replace(/\D/g, '');
    if (numericId) parts.push(`collection_id:${numericId}`);
  }
  // Search across common fields (no brand/vendor bias)
  parts.push(`(title:*${escaped}* OR sku:${escaped} OR tag:${escaped} OR product_type:*${escaped}*)`);
  const searchQuery = parts.join(' AND ');

  const gql = `
    query ProductSearch($first: Int!, $after: String, $query: String!) {
      products(first: $first, after: $after, query: $query) {
        pageInfo {
          hasNextPage
          endCursor
          startCursor
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            title
            handle
            tags
            variants(first: 200) {
              edges {
                node {
                  id
                  title
                  price
                  compareAtPrice
                  sku
                  image {
                    altText
                    id
                    originalSrc
                  }
                  selectedOptions {
                    name
                    value
                  }
                  inventoryItem {
                    id
                    inventoryLevels(first: 1) {
                      edges {
                        node {
                          quantities(names: "available") {
                            name
                            quantity
                          }
                          location {
                            name
                          }
                        }
                      }
                    }
                  }
                  metafields(first: 10, namespace: "custom") {
                    edges {
                      node {
                        key
                        namespace
                        value
                        type
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
              }
            }
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                  id
                }
              }
            }
          }
        }
      }
    }`;
 

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': A_TOKEN,
      },
      body: JSON.stringify({
        query: gql,
        variables: { first: Number(limit) || 20, after: cursor || null, query: searchQuery }
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    const conn = json?.data?.products;
    const items = (conn?.edges || []).map(e => e.node);

    return {
      items,
      nextCursor: conn?.pageInfo?.hasNextPage ? conn?.pageInfo?.endCursor : null,
      pageInfo: conn?.pageInfo,
      raw: json?.data, // optional: remove in production
    };
  } catch (error) {
    console.error('Search failed:', error?.message || error);
    return null;
  }
}


