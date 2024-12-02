const mongoose = require('mongoose')

const restaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    customerReviews: {
        type: [{
            rating: {
                type: Boolean,
                required: true,
                default: 0
            },
            name: {
                type: String,
                required: true
            },
            place: {
                type: String,
                required: true
            },
            createdOn: {
                type: Date,
                default: Date.now
            },
            image: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }],
        required: true
    },
    minOrder: {
        type: Number,
        required: true
    },
    deliveryInfo: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    },
    contactInfo: {
        type: {
            phoneNumber: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            website: {
                type: String,
                required: true
            }
        },
        required: true
    },
    openTill: {
        type: String,
        required: true
    },
    mapLocation: {
        type: String,
        required: true
    },
    tagLine: {
        type: String,
        required: true
    },
    bgImg: {
        type: String,
        required: true
    }
}) 

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema)

module.exports = RestaurantModel