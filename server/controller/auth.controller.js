const services = require("../services/auth.service.js");
const bcrypt = require('bcrypt');

// Response handlers
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const User = require("../model/userSchema.js");
const ActiveUser = require('../model/activeUserSchema.js');
const { dbConnection } = require("../config/db.js");
const Location = require('../model/locationSchema.js')
const jwt = require('jsonwebtoken');
const DiscountConfig = require("../model/DiscountConfig.js");
// const client = require('../utils/redisClient.js');

exports.signUp = async (req, res) => {
  try {

    const userName = req.body.userName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const role = req.body.role;


    //console.log("userName",userName);
    //console.log("email",email);
    //console.log("phoneNumber",phoneNumber);
    //console.log("password",password);
    //console.log("role",role);

    const result = await services.signUp(userName, email, phoneNumber, password, role);
    if (!result) {
      //console.log(result, "INTERNAL_SERVER_ERROR")
      return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.USER_ALREADY_EXIST);
    }
    return sendResponse(res, statusCode.OK, true, SuccessMessage.SIGNUP_SUCCESS, result);
  } catch (error) {
    //console.log(error, "errrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};




// // create access token controller
// exports.login = async (req, res) => {
//     try {
//         const {email , password} = req.body;



//         const result = await services.login(email, password);
//         if (!result) {
//             return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
//         }
//         return sendResponse(res, statusCode.OK, true, SuccessMessage.LOGIN_SUCCESS, result);
//     } catch (error) {
//         //console.log(error)
//         return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
//     }
// };




exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await services.findUserForLogin(email);

    if (!user) {
      return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.USER_NOT_FOUND);
    }

    if (user.role !== role) {
      return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.NOT_AUTHORIZED);
    }


    const loginResult = await services.passwordCompareForLogin(user, password);

    if (!loginResult) {
      return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    return sendResponse(res, statusCode.OK, true, SuccessMessage.LOGIN_SUCCESS, loginResult);

  } catch (error) {
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};


exports.adminChangePassword = async (req, res) => {
  try {

    const { email, oldPassword, newPassword } = req.body;

    // Fetch the user
    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.ADMIN_NOT_FOUND, email);

    // Ensure the user is the admin
    if (user.role !== 'admin') {
      return sendResponse(res, statusCode.FORBIDDEN, false, ErrorMessage.ONLY_ADMIN_CAN_CHANGE_PASSWORD, email);
    }

    // Validate current password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return sendResponse(res, statusCode.UNAUTHORIZED, false, ErrorMessage.WRONG_EMAIL_OR_PASSWORD, email);

    // Prevent reusing the same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.NEWPASSWORD_SAME_AS_OLD, email);

    // Hash and update the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedNewPassword;
    await user.save();

    return sendResponse(res, statusCode.OK, true, SuccessMessage.PASSWORD_CHANGED_SUCCESSFULLY, email);
  } catch (error) {
    console.error('Admin change password error:', error);
    return false;
  }
};





//Using Pay (Redis ex- Upstash)
// exports.trackAnonymousUser = async (req, res) => {
//   console.log("trackAnonymousUser CALLED1");
//   try {
//     const { anonId } = req.body;
//     if (!anonId) return res.status(400).json({ message: 'anonId required' });
//     console.log("anonId", anonId)
//     await client.set(`activeUser:${anonId}`, 'true', { EX: 300 }); // expires in 5 minutes
//     res.status(200).json({ message: 'Activity tracked' });
//   } catch (err) {
//     console.error('Activity Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


//Using Pay (Redis ex- Upstash)
// exports.getActiveUserCount = async (req, res) => {
//     console.log("getActiveUserCount called1");
//   try {
//     const keys = await client.keys('activeUser:*');
//     res.status(200).json({ activeUserCount: keys.length });
//   } catch (err) {
//     console.error('Count Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };




// exports.trackAnonymousUser = async (req, res) => {
//   console.log("trackAnonymousUser CALLED2");
//   try {
//     await dbConnection();
//     const { anonId } = req.body;
//     if (!anonId) return res.status(400).json({ message: 'anonId required' });

//     console.log(`Tracking ping from anonId: ${anonId} at ${new Date().toISOString()}`);

//     await ActiveUser.findOneAndUpdate(
//       { anonId },
//       { lastActive: new Date() },
//       { upsert: true }
//     );

//     res.status(200).json({ message: 'Activity tracked' });
//   } catch (err) {
//     console.error('Activity Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.trackActiveUsersWithLocation = async (req, res) => {
  try {
    await dbConnection();
    const { anonId, location } = req.body;

    if (!anonId) {
      return res.status(400).json({ message: 'anonId required' });
    }

    const update = { lastActive: new Date() };

    if (location) {
      update.location = {
        city: location.city,
        country: location.country,
        region: location.region,
        lat: location.lat,
        lon: location.lon,
        ip: location.ip,
        timestamp: new Date()
      };
    }

    await ActiveUser.findOneAndUpdate(
      { anonId },
      update,
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'successfully' });
  } catch (err) {
    console.error('UserT error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




// exports.getActiveUserCount = async (req, res) => {
//   console.log("getActiveUserCount called2");
//   try {
//     const cutoff = new Date(Date.now() - 5 * 60 * 1000); // last 5 min
//     const activeUsersData = await ActiveUser.countDocuments({ lastActive: { $gte: cutoff } });
//     res.status(200).json({ activeUserCount: activeUsersData });
//   } catch (err) {
//     console.error('Count Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.getActiveUsersWithLocation = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 5 * 60 * 1000); // 5 min active window
    const users = await ActiveUser.find({ lastActive: { $gte: cutoff } })
      .sort({ lastActive: -1 })
      .lean();  // lean for plain JS objects

    res.status(200).json({
      activeUserCount: users.length,
      users
    });

  } catch (err) {
    console.error('getActiveUsersWithL error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



//track Location API 

// exports.trackLocation = async (req, res) => {
//   console.log("trackLocation CALLED function");
//   try {
//     const { city, country, region, lat, lon, ip } = req.body;
//     await Location.create({ city, country, region, lat, lon, ip });
//     res.status(200).json({ message: 'Location saved' });
//   } catch (err) {
//     console.error('trackLocation Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



exports.getTrackedLocation = async (req, res) => {
  console.log("getTrackedLocation CALLED function");
  try {
    const locations = await Location.find().sort({ timestamp: -1 });
    res.status(200).json(locations);
  } catch (err) {
    console.error('tragetTrackedLocation Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




//////////////////////////login



function signSession(payload, ttlSeconds = 30 * 60) {
  return jwt.sign(payload, process.env.SESSION_SECRET, { expiresIn: ttlSeconds });
}

function verifySession(token) {
  return jwt.verify(token, process.env.SESSION_SECRET);
}

//login to shopify
exports.logintest = async (req, res) => {

  console.log("Login Called")
  const { email, password } = req.body;
  console.log("email Called", email)
  console.log("password Called", password)
  try {
    const resp = await fetch(`https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_KEY
      },
      body: JSON.stringify({
        query: `
          mutation($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken { accessToken expiresAt }
              userErrors { field message }
            }
          }`,
        variables: { input: { email, password } }
      })
    });
    // console.log("resp",resp)
    const data = await resp.json();
    // console.log("data",data)
    const result = data?.data?.customerAccessTokenCreate;
    const accessToken = result?.customerAccessToken?.accessToken;
    const errorMsg = result?.userErrors?.[0]?.message;

    if (!accessToken) {
      return res.status(401).send(`Login failed${errorMsg ? ': ' + errorMsg : ''}`);
    }

    // Option A (simple): store ONLY a session with a flag & no PII
    const appJwt = signSession({
      typ: 'design_sess', // mark type
      st: accessToken // store token to use server-side to fetch customer info when needed
    });

    res.cookie('design_sess', appJwt, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 30 * 60 * 1000
    });

    return res.status(200).send('Login success');
    // return res.redirect(302, next || '/design');
  } catch (e) {
    return res.status(500).send(e.message);
  }

};

//details of user get from shopif 
exports.meTest = async (req, res) => {
  console.log("dddd")
  const token = req.cookies['design_sess'];
  if (!token) return res.status(401).json({ ok: false });

  try {
    const payload = verifySession(token);
    const storefrontToken = payload.st;
    // Call Storefront API to fetch customer info with the token
    const resp = await fetch(`https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_KEY,
        'X-Shopify-Customer-Access-Token': storefrontToken
      },
      body: JSON.stringify({
        query: `
          query {
            customer {
              id
              email
              firstName
              lastName
            }
          }`
      })
    });
    const data = await resp.json();
    const customer = data?.data?.customer;
    if (!customer) return res.status(401).json({ ok: false });
    return res.json({ ok: true, customer });
  } catch (e) {
    return res.status(401).json({ ok: false, message: e.message });
  }

};


//signup
exports.signUpTest = async (req, res) => {
  const { email, password, firstName, lastName, next } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email and password are required' });
  }

  try {
    // 1) Create the customer (Storefront API)
    const createResp = await fetch(`https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_KEY
      },
      body: JSON.stringify({
        query: `
          mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer { id email }
              userErrors { field message }
            }
          }
        `,
        variables: {
          input: {
            email,
            password,
            firstName,
            lastName,
            acceptsMarketing: false
          }
        }
      })
    });

    const createJson = await createResp.json();
    const cResult = createJson?.data?.customerCreate;
    const cErrors = cResult?.userErrors || [];
    const createdCustomer = cResult?.customer;

    if (!createdCustomer) {
      return res.status(400).json({
        ok: false,
        error: cErrors[0]?.message || 'Could not create customer',
        details: cErrors
      });
    }

    // ⚠️ If your store requires email confirmation, you might NOT want to auto-login here.
    // For most stores, you can auto-login:

    const tokenResp = await fetch(`https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_KEY
      },
      body: JSON.stringify({
        query: `
          mutation login($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken { accessToken expiresAt }
              userErrors { field message }
            }
          }
        `,
        variables: { input: { email, password } }
      })
    });

    const tokenJson = await tokenResp.json();
    const tResult = tokenJson?.data?.customerAccessTokenCreate;
    const accessToken = tResult?.customerAccessToken?.accessToken;
    const tErrors = tResult?.userErrors || [];

    if (!accessToken) {
      // Account created but cannot login (e.g., requires email confirmation)
      return res.status(201).json({
        ok: true,
        created: true,
        needsVerification: true,
        message: tErrors[0]?.message || 'Account created. Please check your email to activate before logging in.'
      });
    }

    // 3) Issue your own short-lived app session (JWT in HttpOnly cookie)
    const appJwt = signSession({ typ: 'design_sess', st: accessToken }); // keep payload minimal
    res.cookie('design_sess', appJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 60 * 1000
    });

    return res.status(201).json({
      ok: true,
      created: true,
      loggedIn: true,
      // redirect: next || '/design'
    });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ ok: false, error: 'Signup error' });
  }

};

exports.logoutTest = async (req, res) => {
  res.clearCookie('design_sess', { path: '/' });
  res.json({ ok: true });
};

////////////////////////pricing logic 

//  function getTier(totalQty) {
// const cfg = DiscountConfig.findOne({ key: "global" }).lean();
//   const tiers = (cfg?.tiers || []).sort((a, b) => a.minQty - b.minQty);

//   // pick highest eligible tier
//   let chosen = { minQty: 1, rate: 0 };
//   for (const t of tiers) if (totalQty >= t.minQty) chosen = t;
//   return chosen;
// }



const CATALOG = {
  "jersey-tank": 20,
  "cotton-tee": 18
};

const DEFAULT_SURCHARGES = { "XL": 1, "2XL": 2, "3XL": 3 };
const DEFAULT_LICENSE_FEE = process.env.DEFAULT_LICENSE_FEE;

// ---- Helpers ----
function round(n) {
  return Math.round(n * 100) / 100;
}






//dicounts on qty in %
const DEFAULT_TIERS = [
  { minQty: 1, rate: 0.00 },
  { minQty: 10, rate: 0.05 },
  { minQty: 25, rate: 0.10 },
  { minQty: 50, rate: 0.15 },
  { minQty: 100, rate: 0.20 }
];

function normalizeTiers(tiers) {
  // coerce numbers, drop invalid, sort ascending by minQty, and dedupe
  const clean = (tiers || [])
    .map(t => ({
      minQty: Number(t.minQty),
      rate: Number(t.rate)
    }))
    .filter(t => Number.isFinite(t.minQty) && t.minQty >= 1 &&
      Number.isFinite(t.rate) && t.rate >= 0 && t.rate <= 1)
    .sort((a, b) => a.minQty - b.minQty);

  // remove duplicate minQty entries keeping the last
  const seen = new Map();
  clean.forEach(t => seen.set(t.minQty, t.rate));
  return Array.from(seen, ([minQty, rate]) => ({ minQty, rate }));
}

exports.getDiscountDetails = async (req, res) => {
  try {
    let cfg = await DiscountConfig.findOne({ key: "global" }).lean();

    if (!cfg) {
      // initialize with defaults on first run
      cfg = await DiscountConfig.create({ key: "global", tiers: DEFAULT_TIERS });
    }

    res.json({ tiers: cfg.tiers });
  } catch (err) {
    console.error("getDiscountDetails error:", err);
    res.status(500).json({ error: "Failed to fetch discount tiers" });
  }
};

exports.setDiscountDetails = async (req, res) => {
  try {
    const tiers = req.body && req.body.tiers;
    if (!Array.isArray(tiers) || tiers.length === 0) {
      return res.status(400).json({ error: "tiers array required" });
    }

    const normalized = normalizeTiers(tiers);
    if (normalized.length === 0) {
      return res.status(400).json({ error: "no valid tiers after normalization" });
    }

    const updated = await DiscountConfig.findOneAndUpdate(
      { key: "global" },
      { $set: { tiers: normalized } },
      { new: true, upsert: true }
    ).lean();

    res.json({ ok: true, tiers: updated.tiers });
  } catch (err) {
    console.error("setDiscountDetails error:", err);
    res.status(500).json({ error: "Failed to save discount tiers" });
  }
};



async function getTiers() {
  try {
    const cfg = await DiscountConfig.findOne({ key: "global" }).lean();
    const tiers = (cfg?.tiers || []).sort((a, b) => a.minQty - b.minQty);
    return tiers.length ? tiers : DEFAULT_TIERS;
  } catch (e) {
    console.log("Error fetching tiers from DB", e.message);
    return DEFAULT_TIERS;
  }
}



function pickTier(tiers, totalQty) {
  if (!Array.isArray(tiers)) {
    return { minQty: 1, rate: 0 }; // fallback if not array
  }

  let chosen = { minQty: 1, rate: 0 };
  for (const t of tiers) {
    if (totalQty >= t.minQty) {
      chosen = t;
    }
  }
  return chosen;
}

exports.calculatePrice = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const flags = req.body.flags || {};
    const extras = req.body.extras || {};

    const surcharges = Object.assign({}, DEFAULT_SURCHARGES, extras.sizeSurcharges || {});
    const licenseFeeFlat = typeof extras.licenseFeeFlat === "number"
      ? extras.licenseFeeFlat
      : DEFAULT_LICENSE_FEE;

    // 1) Build base breakdown first (to get total qty)
    const baseBreakdown = items.map(it => {
      const unitPrice = typeof it.unitPrice === "number" ? it.unitPrice : "";
      if (typeof unitPrice !== "number") {
        throw new Error(`Missing unitPrice for sku ${it.sku}`);
      }

      const sizes = it.sizes || {};
      const sizeBreakdown = Object.entries(sizes).map(([size, rawQty]) => {
        const qty = Math.max(0, Number(rawQty) || 0); // guard: coerce to number, no negatives
        const surcharge = typeof surcharges[size] === "number" ? surcharges[size] : 0;
        const baseLine = (unitPrice + surcharge) * qty;
        return {
          size,
          qty,
          unitPrice,
          surcharge,
          lineBeforeDiscount: round(baseLine)
        };
      }).filter(r => r.qty > 0); // drop zero-qty rows

      const quantity = sizeBreakdown.reduce((s, r) => s + r.qty, 0);
      const subtotalBefore = round(sizeBreakdown.reduce((s, r) => s + r.lineBeforeDiscount, 0));
      return { sku: it.sku, name: it.name, unitPrice, quantity, sizeBreakdown, subtotalBefore };
    }).filter(it => it.quantity > 0); // drop items with no qty

    // 2) Determine discount rate from total quantity (FROM DB)
    const totalQuantity = baseBreakdown.reduce((s, i) => s + i.quantity, 0);

    // 🔽 NEW: read tiers from Mongo and pick highest eligible tier
    const tiers = await getTiers(); 
    console.log("tiers",tiers)          // loads { minQty, rate }[] from DB
    const tier = pickTier(tiers, totalQuantity);
    const discountRate = tier?.rate || 0;

    // 3) Apply discount to each size line and compute after-discount totals
    const itemBreakdown = baseBreakdown.map(it => {
      const sizeBreakdown = it.sizeBreakdown.map(r => {
        const discountedUnitPrice = round((r.unitPrice + r.surcharge) * (1 - discountRate));
        const lineAfterDiscount = round(discountedUnitPrice * r.qty);
        return {
          size: r.size,
          qty: r.qty,
          unitPrice: r.unitPrice,
          surcharge: r.surcharge,
          lineBeforeDiscount: r.lineBeforeDiscount,
          discountedUnitPrice,     // after-discount unit price
          lineAfterDiscount        // after-discount line total
        };
      });

      const subtotalAfter = round(sizeBreakdown.reduce((s, r) => s + r.lineAfterDiscount, 0));

      return {
        sku: it.sku,
        name: it.name,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        sizeBreakdown,
        subtotalBefore: it.subtotalBefore,
        subtotalAfter
      };
    });

    // 4) Summary based on before/after
    const baseSubtotal = round(itemBreakdown.reduce((s, i) => s + i.subtotalBefore, 0));
    const discountedSubtotal = round(itemBreakdown.reduce((s, i) => s + i.subtotalAfter, 0));
    const discountAmount = round(baseSubtotal - discountedSubtotal);

    const fees = {
      licenseFee: flags.collegiateLicense ? licenseFeeFlat : 0
    };

    const grandTotal = round(discountedSubtotal + fees.licenseFee);

    res.json({
      summary: {
        totalQuantity,
        baseSubtotal,
        discountTier: { threshold: tier?.minQty || 1, rate: discountRate },
        discountAmount,
        fees,
        grandTotal
      },
      items: itemBreakdown
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Bad request" });
  }
};
