const controllers = require("../controller/customer.controller.js");
const express = require("express");
const { verifyShopifyWebhook } = require("../schema/customerValidation.js");
const router = express.Router();


// router.get('/recent-order-details', controllers.recentOrder);
router.post('/order-list', controllers.getOrderList);
// router.delete('/order/cancel', controllers.cancelOrder);
router.post('/order-creation', controllers.orderCreationWEbHooks);

module.exports = router;