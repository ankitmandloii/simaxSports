const controllers = require("../controller/customer.controller.js");
const express = require("express");
const router = express.Router();


// router.get('/recent-order-details', controllers.recentOrder);
router.post('/order-list', controllers.getOrderList);
// router.delete('/order/cancel', controllers.cancelOrder);


module.exports = router;