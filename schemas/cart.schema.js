const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [{
            foodItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'FoodItem',
                required: true
            },
            foodInfo: {
                type: {
                    name: {
                        type: String,
                        required: true
                    },
                    category: {
                        type: String,
                        required: true,
                        enum: ['burger', 'pizza', 'soups', 'salads', 'drinks']
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
                    }
                },
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        required: false
    }
})

const CartModel = mongoose.model('Cart', cartSchema)

module.exports = CartModel