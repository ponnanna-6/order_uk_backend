const express = require('express')
const router = express.Router()

const FoodItem = require('../schemas/foodItem.schema')

//add items
router.post('/add', async (req, res) => {
    try {
        const { name, category, description, price, image, restaurant } = req.body;

        if (!name || !category || !description || !price || !image || !restaurant) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const foodItem = new FoodItem({ name, category, description, price, image, restaurant });

        await foodItem.save();
        return res.status(200).json({ message: "Food item created successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: error });
    }
});

//Fetch food item by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const foodItem = await FoodItem.find({ _id: id }).select('-__v');
        if (!foodItem.length) {
            return res.status(400).json({ message: "Food not found" });
        }
        res.status(200).json(foodItem[0]);
    } catch (err) {
        res.status(400).json(err);
    }
});

//Fetch all foods by restaurants
router.get('/', async (req, res) => {
    try {
        const foodItems = await FoodItem.find({}).select('-__v');
        if (!foodItems.length) {
            return res.status(400).json({ message: "Restaurants food not found" });
        }
        res.status(200).json(foodItems);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/search/items', async (req, res) => {
    try {
        const { query } = req.query;

        let foodItems;

        // If no query is provided, return all food items
        if (!query || query.trim() === '') {
            foodItems = await FoodItem.find({}).select('-__v');
        } else {
            foodItems = await FoodItem.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            }).select('-__v');
        }

        if (!foodItems.length) {
            return res.status(404).json({ message: "No food items match your search query." });
        }

        res.status(200).json(foodItems);
    } catch (err) {
        res.status(500).json({ message: "An error occurred. Please try again later.", error: err });
    }
});

module.exports = router