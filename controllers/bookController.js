const Book = require("../models/Book");
const cloudinary = require("../config/cloudinary");

// Search books by name or filter by author/department
exports.searchBooks = async (req, res) => {
  const { query, filterBy } = req.query;
  let filter = {}
  
  if (query) {
    if (filterBy === "author") {
      filter.author = { $regex: query, $options: "i" };
    } else if (filterBy === "department") {
      filter.department = { $regex: query, $options: "i" };
    } else {
      // Default to searching by book title
      filter.name = { $regex: query, $options: "i" };
    }
  }

  try {
    const books = await Book.find(filter);
    res.render("books/index", { books, query, filterBy });
  } catch (err) {
    res.status(500).send("Error searching books");
  }
};

// Controller function to save books to mongoDB
exports.addBook = async (req, res) => {
    try {
        console.log("Received POST request:", req.body);
        console.log("File uploaded:", req.file);

        const { name, author, department, description } = req.body;
       
        if (!req.file) {
            console.error("No file uploaded.");
            return res.status(400).send("Please upload a cover image.");
        }

        console.log("File path from Cloudinary:", req.file.path);
        const newBook = new Book({ name, author, department, description, coverImage: req.file.path });

        await newBook.save();
        console.log("Book successfully saved to DB!");

        res.redirect("/admin/books/add");
    } catch (err) {
        console.error("Error adding book:", err);
        res.status(500).send("Error adding book.");
    }
};
