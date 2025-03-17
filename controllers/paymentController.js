const Order = require("../models/Order");
const Cart = require("../models/Cart");

const processPayment = async (req, res) => {
    try {
        console.log("Processing payment");

        const userId = req.user._id;
        const { cardNumber } = req.body; // Fake payment processing

        console.log(" Received card number:", cardNumber);

        if (!cardNumber || cardNumber.length < 12) {
            console.log("Invalid card details");
            req.flash("error", "Invalid card details.");
            return res.redirect("/checkout");
        }

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            console.log("Cart is empty");
            req.flash("error", "Your cart is empty.");
            return res.redirect("/cart");
        }

        console.log("Cat found, proceeding with order...")

        // Create a new order
        const newOrder = new Order({
            userId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            status: "Completed",
        });

        await newOrder.save();
        await Cart.deleteOne({ userId });

        console.log("Order saved successfully!")

        // Reset cart count
        req.session.cart = { items: [], totalPrice: 0 };
        req.session.cartCount = 0;
        await req.session.save();

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
