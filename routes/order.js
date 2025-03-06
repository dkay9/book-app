const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { ensureAuth, ensureAdmin } = require("../middleware/auth");

router.post("/create", ensureAuth, orderController.createOrder);
router.get("/", ensureAuth, orderController.viewOrders);

// Admin route to update order status
router.post("/update-status/:orderId", ensureAuth, ensureAdmin, orderController.updateOrderStatus);
// Admin routes to view orders
router.get("/admin/orders", ensureAuth, ensureAdmin, orderController.viewAllOrders);



module.exports = router;
