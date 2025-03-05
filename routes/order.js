const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { ensureAuth } = require("../middleware/auth");

router.post("/create", ensureAuth, orderController.createOrder);
router.get("/", ensureAuth, orderController.viewOrders);


module.exports = router;
