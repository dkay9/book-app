const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const passport = require("../middleware/passport");


// Routes for rendering pages
router.get("/signup", authController.renderSignup);
router.get("/login", authController.renderLogin);

// Routes for handling authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
