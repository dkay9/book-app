const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find user's cart
        const cart = await Cart.findOne({ userId }).populate("items.bookId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Your cart is empty.");
        }

        // Create order from cart
        const order = new Order({
            userId,
            items: cart.items.map(item => ({
                bookId: item.bookId._id,
                name: item.bookId.name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalPrice: cart.totalPrice,
            status: "Pending",
        });

        await order.save();

        // Clear user's cart after order is placed
        await Cart.deleteOne({ userId });

        res.redirect("/orders"); // Redirect to order history page
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).send("Error processing your order.");
    }
};
// viewing users past orders
exports.viewOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.render("orders", { orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).send("Error fetching your orders.");
    }
};
