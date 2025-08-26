const services = require("../services/customer.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const emailConfig = require('../config/email.js');
const emailTemplates = require("../utils/emailTemplate.js");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { UserDesigns } = require('../model/designSchemas/UserDesignsSchema.js'); // ← adjust path
//############################################################# Order  #########################################################



function buildEmailData(payload, extras = [], meta = {}) {
    const o = payload || {};
    const currency = o.presentment_currency || o.currency || 'USD';
    const money = (v) => (v == null ? null : String(v));

    // index extras by lineItemId for quick merge
    const extrasById = new Map((extras || []).map(e => [String(e.lineItemId || ''), e]));

    const items = (o.line_items || []).map((li) => {
        const idStr = normalizeId(li.id);
        const ex = extrasById.get(idStr);

        const unit_price = money(li.price);
        const quantity = Number(li.quantity || 0);
        const line_total = (Number(li.price || 0) * quantity).toFixed(2);

        return {
            line_item_id: idStr,
            title: li.title,
            sku: li.sku || null,
            variant_id: li.variant_id || null,
            quantity,
            unit_price,         // per-item price string
            line_total,         // computed

            // merged design fields
            design_id: ex?.designId || '',
            preview_image: ex?.previewImage || '',
            design_images: Array.isArray(ex?.designImages) ? ex.designImages : [],
        };
    });

    return {
        meta: {
            topic: meta.topic ?? null,
            shop_domain: meta.shop_domain ?? null,
            test: !!o.test,
        },
        order: {
            id: o.id,
            admin_graphql_api_id: o.admin_graphql_api_id,
            name: o.name,
            order_number: o.order_number,
            created_at: o.created_at,
            cancelled_at: o.cancelled_at || null,
            cancel_reason: o.cancel_reason || null,
            financial_status: o.financial_status || null,
            fulfillment_status: o.fulfillment_status || null,
            order_status_url: o.order_status_url || null,
            payment_gateways: o.payment_gateway_names || [],
            tags: o.tags || '',
        },
        customer: {
            name: [o.customer?.first_name, o.customer?.last_name].filter(Boolean).join(' ') || null,
            email: o.customer?.email || o.contact_email || null,
        },
        totals: {
            currency,
            subtotal: money(o.subtotal_price),
            shipping: money(o.total_shipping_price_set?.shop_money?.amount),
            discounts: money(o.total_discounts),
            tax: money(o.total_tax),
            total: money(o.total_price),
        },
        addresses: {
            shipping: o.shipping_address || null,
            billing: o.billing_address || null,
        },
        items,
    };
}


exports.sendEmailtoAdminWhileOrdered = async (payload) => {
    try {
        const transporter = nodemailer.createTransport(emailConfig);


        let mailOptions = emailTemplates.sendEmailToAdminWhileOrderTemplate(payload);


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


function normalizeId(x) {
    // Always store as string to avoid JS BigInt precision issues
    return x == null ? '' : String(x);
}

function getProp(li, key) {
    const props = li?.properties || [];
    const hit = props.find(p => (p?.name || p?.key) === key);
    return hit?.value ?? '';
}


function extractLineItemExtras(order) {
    const items = order?.line_items || [];
    return items.map((li) => {
        const designId =
            getProp(li, 'Design ID') ||
            getProp(li, 'design_id') ||
            getProp(li, 'designId');

        const previewImage = getProp(li, 'Preview Image');

        const designImages = [
            { label: 'Design Front', url: getProp(li, 'Design Front') },
            { label: 'Design Back', url: getProp(li, 'Design Back') },
            { label: 'Design Left', url: getProp(li, 'Design Left') },
            { label: 'Design Right', url: getProp(li, 'Design Right') },
        ].filter(x => x.url);

        return {
            lineItemId: normalizeId(li.id || li.admin_graphql_api_id || ''),
            title: li.title,
            quantity: li.quantity,
            designId: designId || '',
            previewImage: previewImage || '',
            designImages, // [{label,url}]
        };
    });
}


function mergeExtras(...lists) {
    const byId = new Map();

    const mergeOne = (target, src) => {
        const out = { ...target };
        // fill simple fields if empty
        for (const k of ['title', 'quantity', 'designId', 'previewImage']) {
            if (!out[k] && src[k]) out[k] = src[k];
        }
        // merge designImages by label/url, keep unique non-empty
        const a = Array.isArray(out.designImages) ? out.designImages : [];
        const b = Array.isArray(src.designImages) ? src.designImages : [];
        const seen = new Set(a.map(x => `${x.label}|${x.url}`));
        for (const x of b) {
            const sig = `${x.label}|${x.url}`;
            if (x?.url && !seen.has(sig)) {
                a.push({ label: x.label, url: x.url });
                seen.add(sig);
            }
        }
        out.designImages = a;
        return out;
    };

    for (const list of lists) {
        for (const e of (Array.isArray(list) ? list : [])) {
            const id = normalizeId(e.lineItemId);
            if (!id) continue;
            if (byId.has(id)) {
                byId.set(id, mergeOne(byId.get(id), e));
            } else {
                byId.set(id, { ...e, lineItemId: id });
            }
        }
    }
    return Array.from(byId.values());
}



const isObjectIdHex = (s) => typeof s === 'string' && /^[a-fA-F0-9]{24}$/.test(s);
const OID = (s) => new mongoose.Types.ObjectId(s);

/**
 * Set status="ordered" for each design subdoc matched by _id.
 * Accepts an array of 24-hex Design IDs (subdoc _ids).
 * No version bump, no timestamps, no extra fields.
 */
async function markDesignsOrderedStatusOnly(designIds = []) {
    const unique = [...new Set(
        (designIds || []).filter(Boolean).map(String).filter(isObjectIdHex)
    )];
    if (!unique.length) return { matched: 0, modified: 0 };

    const ops = unique.map((id) => ({
        updateOne: {
            filter: { "designs._id": OID(id) },
            update: { $set: { "designs.$.status": "ordered" } },
        },
    }));

    const result = await UserDesigns.bulkWrite(ops, { ordered: false });
    return {
        matched: result.matchedCount ?? 0,
        modified: result.modifiedCount ?? 0,
    };
}

//it wil calling from index.js
exports.orderPaymentDoneForOrderWEbHooks = async (req, res) => {
  try {
    const orderData = req.body;

    // 1) design IDs from payload
    const extracted = extractLineItemExtras(orderData);
    const manualExtras = Array.isArray(req.body.design_extras) ? req.body.design_extras : [];
    const mergedExtras = mergeExtras(extracted, manualExtras);
    const designIds = mergedExtras.map(x => x.designId).filter(Boolean);

    // 2) build email
    // const emailData = buildEmailData(orderData, mergedExtras, {
    //   topic: req.get('X-Shopify-Topic') || null,
    //   shop_domain: req.get('X-Shopify-Shop-Domain') || null,
    // });

    // 3) send email first
    // const sent = await this.sendEmailtoAdminWhileOrdered(emailData);

    // 4) only if email succeeded, set status="ordered" (status-only update)
    // if (sent) {
      const summary = await markDesignsOrderedStatusOnly(designIds);
      console.log('Design status updated (ordered):', summary);
    // } else {
    //   console.warn('Email failed; skipped design status update');
    // }

    // 5) respond
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).send('Internal Server Error');
  }
};


exports.orderCreationWEbHooks = async (req, res) => {
    try {
        verifyShopifyWebhook(req, res, req.body);
        const orderData = JSON.parse(req.body);
        console.log('Order webhook data:', orderData);

        // TODO: Process orderData (save to DB, update status, etc.)

        res.status(200).send('OK');
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(401).send('Unauthorized');
    }
};




// remove customer favorite product in list
exports.getOrderList = async (req, res) => {
    try {

        const result = await services.getOrderList();
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
    } catch (error) {
        console.log(error);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
// // cancel shop order
// exports.cancelOrder = async (req, res) => {
//     try {
//         const session = res.locals.shopify.session || res.locals.shopify;
//         const orderId = req.query.orderId
//         const result = await services.cancelOrder(orderId, session);
//         return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result);
//     } catch (error) {
//         console.log(error);
//         return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
//     }
// }

// //############################################################# Discount  #########################################################

