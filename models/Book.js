const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String }, // URL to book cover image
    price: { type: Number, required: true }, 
});

module.exports = mongoose.model("Book", BookSchema);
