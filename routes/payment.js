const express = require("express");
const router = express.Router();
const { processPayment, checkoutPage } = require("../controllers/paymentController");
const {ensureAuth} = require("../middleware/auth");

console.log("Loaded Payment Controller:", { processPayment, checkoutPage });

// Route to render the checkout page
router.get("/checkout", ensureAuth, checkoutPage);

// Process Payment (Handles form submission)
router.post("/checkout", ensureAuth, processPayment);

module.exports = router;
