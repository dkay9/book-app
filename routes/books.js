const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const bookController = require("../controllers/bookController");

// Student: Search or filter books
router.get("/search", ensureAuth, bookController.searchBooks);


module.exports = router;