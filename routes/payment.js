const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const isAuthenticated = require("../middleware/auth");

// Process Payment (Handles form submission)
router.post("/checkout", isAuthenticated, paymentController.processPayment);

// Route to render the checkout page
router.get("/checkout", isAuthenticated, paymentController.checkoutPage);

module.exports = router;
