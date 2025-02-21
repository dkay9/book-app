const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const passport = require("../middleware/passport");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

module.exports = router;
