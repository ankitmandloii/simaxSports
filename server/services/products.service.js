import env from 'dotenv'
import axios from 'axios';

env.config();

const S_STORE = `${process.env.STORE}`;
const A_TOKEN = `${process.env.TOKEN}`;

const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/2025-04/graphql.json`;







export const getProductsList = async (limit) => {
  let query = `{
  products(first: ${limit}) {
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
  options(first: 50) {
    id
    name
    values
  }

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
       
        
        sku
        
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
  collections(first: 250) {
    edges {
      node {
        description
        descriptionHtml
        id
        handle
        updatedAt
        title
      }
    }
  }
  
  description
 
  handle
  id
  onlineStoreUrl
  productType
  publishedAt
  tags
  title
  updatedAt
  vendor
  sellingPlanGroups(first:1){
nodes{
   
    name
    options
    
}
}
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
    }`;


//for fast and small dataset
// let query = `{
//   products(first: ${limit}) {
//     edges {
//       node {
//         id
//         title
//         handle
//         images(first: 1) {
//           edges {
//             node {
//               originalSrc
//               altText
//             }
//           }
//         }
//         variants(first: 1) {
//           edges {
//             node {
//               id
//               title
//               sku
//             }
//           }
//         }
//       }
//     }
//   }
// }
// `


  //   if (filterQuery) {
  //     query = `{
  //     products(first: ${limit}) {
  // pageInfo {
  //   startCursor
  //   endCursor
  //   hasNextPage
  //   hasPreviousPage
  // }
  // edges {
  // cursor
  // node {
  //   options(first: 50) {
  //     id
  //     name
  //     values
  //   }
  //   availableForSale
  //   variants(first: 250) {
  //     edges {
  //       node {
  //         id
  //         title
  //         image {
  //           altText
  //           id
  //           originalSrc
  //         }
  //         priceV2 {
  //           amount
  //           currencyCode
  //         }
  //         compareAtPriceV2 {
  //           amount
  //           currencyCode
  //         }
  //         availableForSale
  //         quantityAvailable
  //         sku
  //         requiresShipping
  //         selectedOptions {
  //           name
  //           value
  //         }
  //       }
  //     }
  //     pageInfo {
  //       hasNextPage
  //     }
  //   }
  //   collections(first: 250) {
  //     edges {
  //       node {
  //         description
  //         descriptionHtml
  //         id
  //         handle
  //         updatedAt
  //         title
  //       }
  //     }
  //   }
  //   createdAt
  //   description
  //   descriptionHtml
  //   handle
  //   id
  //   onlineStoreUrl
  //   productType
  //   publishedAt
  //   tags
  //   title
  //   updatedAt
  //   vendor
  //   sellingPlanGroups(first:1){
  // nodes{
  //     appName
  //     name
  //     options{
  //         name
  //         values
  //     }
  //     sellingPlans(first:100){
  //         nodes{
  //             checkoutCharge{
  //                 type
  //                 value{
  //                     __typename
  //                     ... on SellingPlanCheckoutChargePercentageValue{
  //                         percentage
  //                     }
  //                 }
  //             }
  //             description
  //             id
  //             name
  //             options{
  //                 name
  //                 value
  //             }
  //             priceAdjustments{

  //                 adjustmentValue{
  //                     __typename
  //                     ...on SellingPlanFixedPriceAdjustment
  //                     {
  //                         price
  //                         {

  //                             amount
  //                             currencyCode
  //                         }
  //                     }
  //                     ...on SellingPlanPercentagePriceAdjustment{
  //                         adjustmentPercentage
  //                     }
  //                     ...on SellingPlanFixedAmountPriceAdjustment{
  //                         adjustmentAmount
  //                         {
  //                             amount
  //                             currencyCode
  //                         }

  //                     }
  //                 }
  //                 orderCount
  //             }
  //             recurringDeliveries
  //         }
  //     }
  // }
  // }
  //   images(first: 250) {
  //     edges {
  //       node {
  //         altText
  //         id
  //         originalSrc
  //       }
  //     }
  //   }
  // }
  // }
  // }
  //     }`
  //   }

  try {
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
    // console.log("Dataaaaaaaaaaaaaaa",response);
    // console.log("_------------------------------------------------_");

    // console.log("Dataaaaaaaaaaaaaaa22222222222",response.data);
    // const products = response.data.data.products.edges.map((edge: any) => edge.node);
    // const products = response.data.products.edges.map(edge => edge.node);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch  products:', error);
    throw new Error('Error fetching products from Shopify');
  }
};

export const getProductFilter = async (title, limit, isCursor) => {
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





// getAllCollectionList Apii


// export const getAllCollectionList = async (limit, cursor) => {
//   console.log("cccccccccccccccccccccccccccccllllllllllllllllllAPI")
//   try {
//   const isCursor = cursor ? `,after:"${cursor}"` : "";

//   const query = `{
//     collections(first: ${limit} ${isCursor}) {
//     pageInfo{
//       startCursor
//       endCursor
//       hasNextPage
//       hasPreviousPage
//     }
//       edges {
//         cursor
//         node {
//           title
//           description
//           descriptionHtml
//           handle
//           id
//           updatedAt
//           image {
//             altText
//             id
//             originalSrc
//           }
//         }
//       }
//     }
//   }`;



//   const response = await axios.post(
//     SHOPIFY_API_URL,
//     { query },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': ACCESS_TOKEN,
//       },
//     }
//   );
//   console.log("Dataaaaaaaaaaaaaaa",response);
//   console.log("Dataaaaaaaaaaaaaaa22222222222",response.data);

//   return response.data;


// } catch (error) {
//   console.error('Failed to fetch  products:', error);
// }
// };

export const getAllCollectionList = async (limit = 50, cursor = null) => {
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
          }
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

    const data = response.data.data.collections;

    // Return both collections and pagination info
    return {
      collections: data.edges.map(edge => edge.node),
      pageInfo: data.pageInfo,
      cursors: data.edges.map(edge => edge.cursor),
    };
  } catch (error) {
    console.error("Failed to fetch collections:", error?.response?.data || error.message);
    throw new Error("Error fetching collections");
  }
};



//product by collcetionId--------


export const getProductsByCollectionId = async (limit, collectionId, cursor) => {
  // console.log("collectionId:", collectionId);

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

    const { data } = response;
    // console.log("GraphQL response data:", data);
    return data.data;

  } catch (error) {
    console.error("Failed to fetch Products:", error?.response?.data || error.message);
    return null;
  }
};

