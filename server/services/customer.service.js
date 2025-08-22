


// exports.reNewAccessToken = async (accessToken, session) => {
//   const client = new shopify.api.clients.Storefront({ session });
//   const data = await client.query({
//     data: {
//       "query": `mutation customerAccessTokenRenew {
//         customerAccessTokenRenew(customerAccessToken: "${accessToken}") {
//           customerAccessToken {
//             accessToken
//             expiresAt
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }`
//     },
//   });
//   return data;
// }

// exports.recentOrder = async (customerId, session) => {
//   const client = new shopify.api.clients.Graphql({ session });
//   const data = await client.query({
//     data: {
//       "query": `
//           query {
//             customer(id: "${customerId}") {
//               id
//               email
//               firstName
//               lastName

//               lastOrder {
//                 currentTotalPriceSet {
//                   presentmentMoney {
//                     amount
//                     currencyCode
//                   }
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 id
//                 closed
//                 closedAt
//                 subtotalPriceSet {
//                   presentmentMoney {
//                     amount
//                     currencyCode
//                   }
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 currentSubtotalLineItemsQuantity
//                 totalDiscountsSet {
//                   presentmentMoney {
//                     amount
//                     currencyCode
//                   }
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 currentTaxLines {
//                   priceSet {
//                     presentmentMoney {
//                       amount
//                       currencyCode
//                     }
//                     shopMoney {
//                       amount
//                       currencyCode
//                     }
//                   }
//                 }
//                 cartDiscountAmountSet {
//                   presentmentMoney {
//                     amount
//                     currencyCode
//                   }
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 originalTotalPriceSet {
//                   presentmentMoney {
//                     amount
//                     currencyCode
//                   }
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 createdAt
//                 totalPriceSet {
//                   presentmentMoney {
//                     amount
//                     currencyCode
//                   }
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 agreements(first: 250) {
//                   nodes {
//                     id
//                     reason
//                   }
//                 }
//                 canMarkAsPaid
//                 canNotifyCustomer
//                 confirmationNumber
//                 confirmed
//                 lineItems(first: 250) {
//                   nodes {
//                     id
//                     product {
//                       priceRangeV2 {
//                         maxVariantPrice {
//                           amount
//                           currencyCode
//                         }
//                         minVariantPrice {
//                           amount
//                           currencyCode
//                         }
//                       }
//                       options(first: 50) {
//                         id
//                         name
//                         values
//                       }
//                       id
//                       handle
//                       collections(first: 250) {
//                         edges {
//                           node {
//                             description
//                             descriptionHtml
//                             handle
//                             id
//                             updatedAt
//                             title
//                           }
//                         }
//                       }
//                       title
//                       createdAt
//                       description
//                       descriptionHtml
//                       images(first: 250) {
//                         edges {
//                           node {
//                             altText
//                             id
//                             originalSrc
//                           }
//                         }
//                       }
//                       variants(first: 250) {
//                         edges {
//                           node {
//                             title
//                             image {
//                               altText
//                               originalSrc
//                               id
//                             }

//                             availableForSale
//                             sku

//                             selectedOptions {
//                               name
//                               value
//                             }
//                             id
//                           }
//                         }
//                       }
//                       onlineStoreUrl
//                       productType
//                       publishedAt
//                       tags
//                       updatedAt
//                       vendor
//                     }
//                     image {
//                       id
//                       url
//                     }
//                     title
//                     currentQuantity
//                   }
//                 }
//                 additionalFees {
//                   id
//                   name

//                   price {
//                     presentmentMoney {
//                       amount
//                       currencyCode
//                     }
//                     shopMoney {
//                       amount
//                       currencyCode
//                     }
//                   }
//                   taxLines {
//                     channelLiable
//                     priceSet {
//                       presentmentMoney {
//                         amount
//                         currencyCode
//                       }
//                       shopMoney {
//                         amount
//                         currencyCode
//                       }
//                     }
//                     rate
//                     ratePercentage
//                     title
//                   }
//                 }
//               }
//             }
//           }
//       `
//     },
//   });
//   return data;
// }
//############################################################# Order  #########################################################

// remove customer favorite product in list
exports.getOrderList = async () => {
  const S_STORE = process.env.SHOPIFY_STORE_URL;
  const A_TOKEN = process.env.SHOPIFY_API_KEY;

  const SHOPIFY_API_URL = `https://${S_STORE}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
  //will implement for Pagination
  const query = `
    {
      orders(first: 10, reverse: true) {
        edges {
          node {
            id
            name
            email
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  sku
                  originalUnitPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            shippingAddress {
              name
              address1
              address2
              city
              zip
              province
              country
            }
            fulfillments {
                trackingInfo {
                number
                url
              }
            }
          }
        }
      }
    }
  `;

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
    console.error('Failed to fetch Order Lists:', error);
    throw new Error('Error fetching Order Lists data from Shopify Admin API');
  }
};


// exports.cancelOrder = async (orderId, session) => {
//   const client = new shopify.api.clients.Graphql({ session });
//   const query = {
//     "query": `mutation orderCancel($orderId: ID!, $reason: OrderCancelReason!, $refund: Boolean!, $restock: Boolean!) {
//       orderCancel(orderId: $orderId, reason: $reason, refund: $refund, restock: $restock) {
//         job {
//           id 
//           done
//         }
//         orderCancelUserErrors {
//          field 
//          message
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }`,
//     "variables": {
//       "notifyCustomer": true,
//       "orderId": orderId,
//       "reason": "CUSTOMER",
//       "refund": true,
//       "restock": true,
//       "staffNote": "Mobilify staff note"
//     },
//   }

//   const data = await client.query({
//     data: query,
//   });
//   return data
// }


