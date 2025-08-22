const services = require("../services/customer.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const emailConfig = require('../config/email.js');
const emailTemplates = require("../utils/emailTemplate.js");
const nodemailer = require('nodemailer');
//############################################################# Order  #########################################################




function buildEmailData(payload) {
    const o = payload || {};
    const currency = o.presentment_currency || o.currency || 'USD';
    const money = (v) => (v == null ? null : String(v));

    const items = (o.line_items || []).map((li) => ({
        title: li.title,
        sku: li.sku || null,
        variant_id: li.variant_id || null,
        quantity: Number(li.quantity || 0),
        unit_price: money(li.price), // per-item price as string
        line_total: (Number(li.price || 0) * Number(li.quantity || 0)).toFixed(2),
    }));

    return {
        meta: {
            // fill these from headers if available:
            topic: null, // e.g., req.get('X-Shopify-Topic')
            shop_domain: null, // e.g., req.get('X-Shopify-Shop-Domain')
            test: !!o.test,
        },
        order: {
            id: o.id,
            admin_graphql_api_id: o.admin_graphql_api_id,
            name: o.name, // e.g., "#9999"
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




//it wil calling from index.js
exports.orderPaymentDoneForOrderWEbHooks = async (req, res) => {
    try {

        const orderData = req.body;
        // console.log('Order Payment Done webhook data:', orderData);

        // TODO: Process orderData (save to DB, update status, etc.)
        //    console.log(buildEmailData(orderData));
        const emailData = buildEmailData(orderData)
        await this.sendEmailtoAdminWhileOrdered(emailData)
        res.status(200).send('OK');
    } catch (err) {
        console.error('Error processing webhook:', err.message);
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

