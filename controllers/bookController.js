const Book = require("../models/Book");
const cloudinary = require("../config/cloudinary");

// Search books by name or filter by author/department
exports.searchBooks = async (req, res) => {
  const { query, filterBy } = req.query;
  let books = []
  
  try {
    if (query) {
        let filter = {}

        if (filterBy === "author") {
        filter.author = { $regex: query, $options: "i" };
        } else if (filterBy === "department") {
        filter.department = { $regex: query, $options: "i" };
        } else {
        // Default to searching by book title
        filter.name = { $regex: query, $options: "i" };
        }
        books = await Book.find(filter);       
    }

    const cartCount = req.session.cartCount || 0; // Get cart count from session

    res.render("books/index", { 
      books, 
      query: query || "", 
      filterBy: filterBy || "name",
      cartCount // Pass count to EJS
    });
  } catch (err) {
    res.status(500).send("Error searching books");
  }
};

// Controller function to save books to mongoDB
exports.addBook = async (req, res) => {
    try {
          console.log("Received POST request:", req.body);
          console.log("File uploaded:", req.file);

           // Check if file uploaded successfully
          const coverImage = req.file ? req.file.path : null; // Cloudinary URL

          if (!coverImage) {
          return res.status(400).send("Error: No image uploaded.");
          }

          // Destructure required fields from req.body
          const { name, author, department, description, price } = req.body;

          // Check if any field is missing
          if (!name || !author || !department || !description || !price) {
             return res.status(400).send("Error: Missing required fields.");
          }

          // Convert price to a number
          const bookPrice = price ? parseFloat(price) : 0;

          // Check if price is a valid number
          if (isNaN(bookPrice)) {
            return res.status(400).send("Error: Invalid price.");
          }

          const newBook = new Book({ name, author, department, description, coverImage, price: bookPrice });
      
          await newBook.save();
          console.log("✅ Book successfully saved to DB:", newBook);
          req.flash("success_msg", "Book uploaded successfully!");
      
          res.redirect("/admin/books/add");
    } catch (err) {
        console.error("Error adding book:", err);
        res.status(500).send("Error adding book.");
    }
};
