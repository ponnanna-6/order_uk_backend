const mongoose = require('mongoose')

const foodItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
})

const FoodItemModel = mongoose.model('FoodItem', foodItemSchema)

module.exports = FoodItemModel