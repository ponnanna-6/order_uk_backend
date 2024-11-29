const express = require('express');
const router = express.Router();

const Cart = require('../schemas/cart.schema');

// Add items to the cart
router.post('/add', async (req, res) => {
    try {
        const { user, items } = req.body;

        if (!user || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: "User and items are required, and items must be an array." });
        }

        let cart = await Cart.findOne({ user });

        if (!cart) {
            cart = new Cart({ user, items });
        } else {
            cart.items = items;
        }

        await cart.save();

        return res.status(200).json({ message: "Cart updated successfully!", cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating the cart. Please try again later.",
            error,
        });
    }
});

module.exports = router;
