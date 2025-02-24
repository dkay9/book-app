const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { ensureAdmin } = require("../middleware/auth");

// Admin Dashboard Route (Protected)
router.get("/dashboard", ensureAdmin, (req, res) => {
  res.render("admin/dashboard", { user: req.user }); // Pass user data to EJS
});

// Render the Add Book Form
router.get("/books/add", ensureAdmin, (req, res) => {
    res.render("admin/addBook");
});

// Handle Book Upload
router.post("/books", ensureAdmin, bookController.addBook);

module.exports = router;