const Order = require("../models/Order");
const Cart = require("../models/Cart");

const processPayment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cardNumber } = req.body; // Fake payment processing

        if (!cardNumber || cardNumber.length < 12) {
            req.flash("error", "Invalid card details.");
            return res.redirect("/checkout");
        }

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            req.flash("error", "Your cart is empty.");
            return res.redirect("/cart");
        }

        // Create a new order
        const newOrder = new Order({
            userId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            status: "Paid",
        });

        await newOrder.save();
        await Cart.deleteOne({ userId });

        req.flash("success", "Payment successful! Your order has been placed.");
        res.redirect("/orders");
    } catch (error) {
        console.error("Payment processing error:", error);
        req.flash("error", "Something went wrong. Try again.");
        res.redirect("/checkout");
    }
};

const checkoutPage = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate("items.bookId");

        if (!cart) {
            req.flash("error", "Your cart is empty.");
            return res.redirect("/cart");
        }

        res.render("checkout", { cart, messages: req.flash() });
    } catch (error) {
        console.error("Error loading checkout page:", error);
        req.flash("error", "Something went wrong.");
        res.redirect("/cart");
    }
};

module.exports = { processPayment, checkoutPage };
