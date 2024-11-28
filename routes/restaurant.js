const express = require('express')
const bcrypt = require('bcrypt')
const Restaurant = require('../schemas/restaurant.schema')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('../middlewares/auth')

//register user
router.post('/add', async (req, res) => {
    try {
        const { name, logo, rating,
            customerReviews, minOrder, deliveryInfo,
            deliveryTime, contactInfo, openTill, mapLocation
        } = req.body;

        if(!name || !logo || !rating || !customerReviews || !minOrder || !deliveryInfo || !deliveryTime || !contactInfo || !openTill || !mapLocation){
            return res.status(400).json({message: "All fields are required"});
        }

        const restaurant = new Restaurant({name, logo, rating,
            customerReviews, minOrder, deliveryInfo,
            deliveryTime, contactInfo, openTill, mapLocation
        });

        await restaurant.save();
        return res.status(200).json({ message: "Restaurant created successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: error});
    }
});

//Fetch user by id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const {id} = req.params
        const restaurant = await Restaurant.find({_id : id}).select('-__v');
        if(!users.length){
            return res.status(400).json({message:"Restaurant not found"});
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router