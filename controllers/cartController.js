const Cart = require("../models/Cart");
const Book = require("../models/Book");

exports.addToCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user ? req.user._id : null; // Ensure the user is logged in

        if (!userId) {
            console.log("❌ User not logged in. Redirecting...");
            return res.status(401).send("You must be logged in to add to cart.");
        }
        // Find the book and get the price
        const book = await Book.findById(bookId);
        if (!book) {
            console.log("❌ Book not found.");
            return res.status(404).send("Book not found.");
        }
        // Find the user's cart or create a new one
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }
        // Check if book is already in cart
        const existingItem = cart.items.find(item => item.bookId.equals(bookId));

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ bookId, quantity: 1, price: book.price });
        }
        // Calculate total price
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0); 
        await cart.save();

        console.log("✅ Book added to cart:", cart);
        res.json({ success: true, message: "Item added to cart!", cartItemCount: cart.items.length });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).send("Error adding book to cart.");
    }
};

//This fetches and displays the cart.
exports.viewCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) return res.redirect("/login");

        const cart = await Cart.findOne({ userId }).populate("items.bookId");

        res.render("cart", { cart });
    } catch (err) {
        console.error("Error viewing cart:", err);
        res.status(500).send("Error loading cart.");
    }
};


// Remove from Cart
exports.removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).send("Cart not found.");

        cart.items = cart.items.filter(item => !item.bookId.equals(bookId));

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        await cart.save();
        res.redirect("/cart");
    } catch (err) {
        console.error("Error removing book from cart:", err);
        res.status(500).send("Error removing book from cart.");
    }
};

// Update Cart Quantity
exports.updateCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).send("Cart not found.");

        let item = cart.items.find(item => item.bookId.equals(bookId));
        if (!item) return res.status(404).send("Item not found in cart.");

        item.quantity = parseInt(quantity);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        await cart.save();
        res.redirect("/cart");
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).send("Error updating cart.");
    }
};