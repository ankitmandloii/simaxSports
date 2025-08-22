const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.js');
const emailTemplates = require('../utils/emailTemplate.js');


exports.sendEmailDesign = async (email, companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);


    let mailOptions = emailTemplates.sendEmailTamplate(email, companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link);


    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return true;
  }
  catch (e) {
    console.error(
      `Error in email send: ${e}`,
    );
    return false;
  }
}




function toShopifyProductGID(id) {
  // Accepts either numeric ID ("1234567890") or full GID ("gid://shopify/Product/1234567890")
  return String(id).startsWith('gid://') ? id : `gid://shopify/Product/${id}`;
}


exports.getProductByIdAsList = async (productId) => {
  const SHOPIFY_API_URL = `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
  const gid = toShopifyProductGID(productId);

  const query = `
    query ProductById($id: ID!) {
      product(id: $id) {
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
                        id
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
  `;

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
      },
      body: JSON.stringify({ query, variables: { id: gid } }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data, errors } = await response.json();
    if (errors) {
      throw new Error(errors.map(e => e.message).join('; '));
    }
    if (!data || !data.product) {
      return null;
    }

    // Wrap the single product to match your list format
    const productNode = data.product;

    const formatted = {
      products: {
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        edges: [
          {
            cursor: productNode.id || null,
            node: productNode,
          },
        ],
      },
    };

    return formatted;
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    throw new Error('Error fetching product by ID from Shopify');
  }
}
