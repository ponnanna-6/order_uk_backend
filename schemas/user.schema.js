const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: false
    },
    district: {
        type: String,
        required: false
    },
    pincode: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    default: {
        type: Boolean,
        default: false
    }
});

const paymentMethodSchema = mongoose.Schema({
    cardNumber: {
        type: String,
        required: true
    },
    cvc: {
        type: String,
        required: true
    },
    expiration: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    default: {
        type: Boolean,
        default: false
    }
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    paymentMethods: {
        type: [paymentMethodSchema],
        required: false,
        default: []
    },
    Addresses: {
        type: [addressSchema],
        required: false,
        default: []
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
