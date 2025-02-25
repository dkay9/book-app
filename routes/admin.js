const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { ensureAdmin } = require("../middleware/auth");
const upload = require('../middleware/multer'); // Use the separate multer middleware
const { addBook } = require('../controllers/admin');

// Admin Dashboard Route (Protected)
// router.get("/dashboard", ensureAdmin, (req, res) => {
//   res.render("admin/dashboard", { user: req.user }); // Pass user data to EJS
// });

// Render the Add Book Form
router.get("/books/add", ensureAdmin, (req, res) => {
    res.render("admin/addBook");
});

// Handle Book Upload
router.post("/books", ensureAdmin, bookController.addBook);

// Route to add a book with an uploaded image
router.post('/add-book', upload.single('coverImage'), addBook);

module.exports = router;