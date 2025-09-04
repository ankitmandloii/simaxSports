// const services = require("../services/cart.service.js");

// Response handlers
// const { sendResponse } = require("../utils/sendResponse.js");
// const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
// const { statusCode } = require("../constant/statusCodes.js");
const fetch =require("node-fetch");
// const dotenv  =require("dotenv");
const { z } = require("zod");



exports.createCart = async (req, res) => {
  try {
    const { lines, buyerIdentity } = zCreateBody.parse(req.body);
    const json = await shopifyGQL(MUT_CART_CREATE, { lines, buyerIdentity });
    const payload = json.data?.cartCreate;
    if (payload?.userErrors?.length) return res.status(400).json(payload.userErrors);
    const cart = payload?.cart;
    setCartCookie(res, cart.id);
    res.json({ cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.addToCart = async (req, res) => {
    try {
    const { cartId, lines } = zAddBody.parse(req.body);
    const json = await shopifyGQL(MUT_CART_LINES_ADD, { cartId, lines });
    const payload = json.data?.cartLinesAdd;
    if (payload?.userErrors?.length) return res.status(400).json(payload.userErrors);
    res.json({ cart: payload?.cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


// Update lines (quantity/attributes)
exports.updateCart = async (req, res) => {
   try {
    const { cartId, lines } = zUpdateBody.parse(req.body);
    const json = await shopifyGQL(MUT_CART_LINES_UPDATE, { cartId, lines });
    const payload = json.data?.cartLinesUpdate;
    if (payload?.userErrors?.length) return res.status(400).json(payload.userErrors);
    res.json({ cart: payload?.cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

 
// Remove lines
exports.removeCart = async (req, res) => {
try {
    const { cartId, lineIds } = zRemoveBody.parse(req.body);
    const json = await shopifyGQL(MUT_CART_LINES_REMOVE, { cartId, lineIds });
    const payload = json.data?.cartLinesRemove;
    if (payload?.userErrors?.length) return res.status(400).json(payload.userErrors);
    res.json({ cart: payload?.cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


exports.getCart = async (req, res) => {
   try {
    const cartId = req.query.cartId || req.cookies[CART_COOKIE];
    if (!cartId) return res.status(400).json({ error: "cartId missing" });
    const json = await shopifyGQL(Q_CART, { cartId });
    res.json({ cart: json.data?.cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.setOrClearNotesCart = async (req, res) => {
    try {
    const { cartId, note } = zNoteBody.parse(req.body);
    const json = await shopifyGQL(MUT_CART_NOTE, { cartId, note });
    const payload = json.data?.cartNoteUpdate;
    if (payload?.userErrors?.length) return res.status(400).json(payload.userErrors);
    res.json({ cart: payload?.cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};



///////////////////////helper function 


const {
  PORT = 3001,
  SHOPIFY_STORE_URL,
  SHOPIFY_API_KEY,
  API_VERSION = "2024-04",
  DEFAULT_COUNTRY = "IN",
  DEFAULT_LANGUAGE = "EN",
  COOKIE_DOMAIN = "localhost",
  COOKIE_SECURE = "false"
} = process.env;
 


if (!SHOPIFY_STORE_URL || !SHOPIFY_API_KEY) {
  console.error("Missing SHOPIFY_STORE_URL or SHOPIFY_API_KEY in .env");
  process.exit(1);
}
 
const ENDPOINT = `https://${SHOPIFY_STORE_URL}.myshopify.com/api/${API_VERSION}/graphql.json`;

 
function gqlHeaders(country = DEFAULT_COUNTRY, language = DEFAULT_LANGUAGE) {
  return {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": SHOPIFY_API_KEY,
    "Shopify-Storefront-Buyer-Locale": `${language}-${country}`
  };
}
function cryptoRandom() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
 
// Basic retry (429/5xx)
async function shopifyGQL(query, variables = {}, opts = {}) {
  const { country = DEFAULT_COUNTRY, language = DEFAULT_LANGUAGE, maxRetries = 2 } = opts;
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: gqlHeaders(country, language),
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && !json.errors) return json;
 
    const status = res.status;
    const retryable = status === 429 || (status >= 500 && status < 600);
    lastErr = new Error(`Shopify ${status} ${JSON.stringify(json)}`);
    if (retryable && attempt < maxRetries) {
      await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
      continue;
    }
    throw lastErr;
  }
  throw lastErr;
}
 
// ---------- GraphQL ----------
const FRAGMENT_CART = `
fragment CartFields on Cart {
  id
  createdAt
  updatedAt
  totalQuantity
  checkoutUrl
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalDutyAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          __typename
          ... on ProductVariant {
            id
            title
            sku
            availableForSale
            price { amount currencyCode }
            product { id title handle }
            image { url altText }
          }
        }
        attributes { key value }
      }
    }
  }
}
`;
 
const MUT_CART_CREATE = `
mutation CartCreate($lines: [CartLineInput!], $buyerIdentity: CartBuyerIdentityInput) {
  cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
    cart { ...CartFields }
    userErrors { field message }
  }
}
${FRAGMENT_CART}
`;
 
const MUT_CART_LINES_ADD = `
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { field message }
  }
}
${FRAGMENT_CART}
`;
 
const MUT_CART_LINES_UPDATE = `
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { field message }
  }
}
${FRAGMENT_CART}
`;
 
const MUT_CART_LINES_REMOVE = `
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { ...CartFields }
    userErrors { field message }
  }
}
${FRAGMENT_CART}
`;
 
const MUT_CART_NOTE = `
mutation CartNoteUpdate($cartId: ID!, $note: String) {
  cartNoteUpdate(cartId: $cartId, note: $note) {
    cart { ...CartFields }
    userErrors { field message }
  }
}
${FRAGMENT_CART}
`;
 
const Q_CART = `
query GetCart($cartId: ID!) {
  cart(id: $cartId) { ...CartFields }
}
${FRAGMENT_CART}
`;
 
// ---------- Validation ----------
const zLine = z.object({
  merchandiseId: z.string().min(10),
  quantity: z.number().int().min(1),
  attributes: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  sellingPlanId: z.string().optional()
});
const zCreateBody = z.object({
  lines: z.array(zLine).min(1),
  buyerIdentity: z.object({
    countryCode: z.string().optional(),
    email: z.string().email().optional(),
    customerAccessToken: z.string().optional()
  }).optional()
});
const zAddBody = z.object({
  cartId: z.string().min(10),
  lines: z.array(zLine).min(1)
});
const zUpdateBody = z.object({
  cartId: z.string().min(10),
  lines: z.array(z.object({
    id: z.string().min(10), // cartLineId
    quantity: z.number().int().min(0).optional(),
    attributes: z.array(z.object({ key: z.string(), value: z.string() })).optional()
  })).min(1)
});
const zRemoveBody = z.object({
  cartId: z.string().min(10),
  lineIds: z.array(z.string().min(10)).min(1)
});
const zNoteBody = z.object({
  cartId: z.string().min(10),
  note: z.string().optional()
});
 
// ---------- Cookie helpers ----------
const CART_COOKIE = "cartId";
function setCartCookie(res, cartId) {
  res.cookie(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: COOKIE_SECURE === "true",
    sameSite: "Lax",
    path: "/",
    domain: COOKIE_DOMAIN
  });
}
 