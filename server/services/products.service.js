

exports.getProductsList = async (limit, cursor = null) => {
  const S_STORE = `${process.env.STORE}`;
  const A_TOKEN = `${process.env.TOKEN}`;

  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;

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
          variants(first: 250) {
            edges {
              node {
                id
                title
                image {
                  originalSrc
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
          images(first: 1) {
            edges {
              node {
                originalSrc
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
};



exports.getProductFilter = async (title, limit, isCursor) => {
  const S_STORE = `${process.env.STORE}`;
  const A_TOKEN = `${process.env.TOKEN}`;

  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;
  try {


    const query = `{
      search(query: "${title}", first: ${limit} types: PRODUCT) {
        edges {
          node {
            ... on Product {
              options(first: 50) {
                id
                name
                values
              }
              collections(first: 250) {
                edges {
                  node {
                    description
                    descriptionHtml
                    handle
                    id
                    updatedAt
                    title
                  }
                }
              }
              id
              handle
              variants(first: 3) {
                edges {
                  node {
                    priceV2 {
                      amount
                      currencyCode
                    }
                    title
                    image {
                      altText
                      originalSrc
                      id
                    }
                    compareAtPriceV2 {
                      amount
                      currencyCode
                    }
                    weightUnit
                    weight
                    availableForSale
                    sku
                    requiresShipping
                    id
                    quantityAvailable
                  }
                }
              }
              onlineStoreUrl
              productType
              publishedAt
              tags
              updatedAt
              vendor
              title
              availableForSale
              createdAt
              description
              descriptionHtml
              images(first: 250) {
                edges {
                  node {
                    altText
                    id
                    originalSrc
                  }
                }
              }
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }`;

    const response = await axios.post(
      SHOPIFY_API_URL,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': A_TOKEN,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};





exports.getAllCollectionList = async (limit = 50, cursor = null) => {
  const S_STORE = `${process.env.STORE}`;
  const A_TOKEN = `${process.env.TOKEN}`;

  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;
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
};


exports.getProductsByCollectionId = async (limit, collectionId, cursor) => {
  const S_STORE = `${process.env.STORE}`;
  const A_TOKEN = `${process.env.TOKEN}`;

  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;
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
                variants(first: 250) {
                  edges {
                    node {
                      id
                      title
                      image {
                        altText
                        id
                        originalSrc
                      }
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
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
};
