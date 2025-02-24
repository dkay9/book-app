const Book = require("../models/Book");

// Search books by name or filter by author/department
exports.searchBooks = async (req, res) => {
  const { query, author, department } = req.query;
  
  let filter = {};
  if (query) filter.name = { $regex: query, $options: "i" }; // Case-insensitive search
  if (author) filter.author = author;
  if (department) filter.department = department;

  try {
    const books = await Book.find(filter);
    res.render("books/index", { books });
  } catch (err) {
    res.status(500).send("Error searching books");
  }
};

// Controller function to save books to mongoDB
exports.addBook = async (req, res) => {
    try {
        const { name, author, department, description, coverImage } = req.body;

        const newBook = new Book({
            name,
            author,
            department,
            description,
            coverImage,
        });

        await newBook.save();
        res.send("Book added successfully!");
    } catch (err) {
        console.error("Error adding book:", err);
        res.status(500).send("Error adding book.");
    }
};
