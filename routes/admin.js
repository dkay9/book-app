const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { ensureAdmin } = require("../middleware/auth");
const upload = require('../middleware/multer'); // Use the separate multer middleware
// const { addBook } = require('../controllers/admin');
const Book = require('../models/Book'); // Import Book model

// Admin Dashboard Route (Protected)
// router.get("/dashboard", ensureAdmin, (req, res) => {
//   res.render("admin/dashboard", { user: req.user }); // Pass user data to EJS
// });


// Render the Add Book Form (Fetch Books for Display)
router.get("/books/add", ensureAdmin, async (req, res) => {
    try {
        const books = await Book.find(); // Fetch all books
        res.render("admin/addBook", { books }); // Pass books data to EJS
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading books");
    }
});


// Handles Book Upload Usinf Multer and Cloudinary
router.post('/books/add', ensureAdmin, upload.single('coverImage'), bookController.addBook);

module.exports = router;