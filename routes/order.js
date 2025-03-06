const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { ensureAuth } = require("../middleware/auth");

router.post("/create", ensureAuth, orderController.createOrder);
router.get("/", ensureAuth, orderController.viewOrders);

// Admin route to update order status
router.post("/update-status/:orderId", ensureAuth, ensureAdmin, orderController.updateOrderStatus);


module.exports = router;
