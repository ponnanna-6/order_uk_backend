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