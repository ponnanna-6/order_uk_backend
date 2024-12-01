const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const Cart = require('../schemas/cart.schema');

// Add items to the cart
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const {items} = req.body;
        console.log(items)

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

// Get cart by user ID
router.get('/id', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching the cart. Please try again later.",
            error,
        });
    }
});

//get cart by cart id
router.get('/public/:id', async (req, res) => {
    try {
        const cartId = req.params.id;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching the cart. Please try again later.",
            error,
        });
    }
});

//rest cart
router.delete('/delete', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = [];
        await cart.save();
        return res.status(200).json({ message: "Cart deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while deleting the cart. Please try again later.",
            error,
        });
    }
});

module.exports = router;
