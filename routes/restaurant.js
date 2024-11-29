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
            deliveryTime, contactInfo, openTill,
            mapLocation, tagLine, bgImg
        } = req.body;

        if(!name || !logo || !rating || !customerReviews || !minOrder || !deliveryInfo || !deliveryTime || !contactInfo || !openTill || !mapLocation || !tagLine || !bgImg) {
            return res.status(400).json({message: "All fields are required"});
        }

        const restaurant = new Restaurant({name, logo, rating,
            customerReviews, minOrder, deliveryInfo,
            deliveryTime, contactInfo, openTill,
            mapLocation, tagLine, bgImg
        });

        await restaurant.save();
        return res.status(200).json({ message: "Restaurant created successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: error});
    }
});

//Fetch restaurant by id
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const restaurant = await Restaurant.find({_id : id}).select('-__v');
        if(!restaurant.length){
            return res.status(400).json({message:"Restaurant not found"});
        }
        res.status(200).json(restaurant[0]);
    } catch (err) {
        res.status(400).json(err);
    }
});

//Fetch all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurant = await Restaurant.find({}).select('-__v');
        if(!restaurant.length){
            return res.status(400).json({message:"Restaurants not found"});
        }
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router