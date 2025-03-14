const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { ensureAuth } = require("../middleware/auth"); // Ensure user is logged in

router.post("/add", ensureAuth, cartController.addToCart);
router.get("/", ensureAuth, cartController.viewCart);
router.post("/remove", ensureAuth, cartController.removeFromCart);
router.post("/update", ensureAuth, cartController.updateCart);
router.get("/count", cartController.getCartCount);

module.exports = router;
