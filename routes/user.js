const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../schemas/user.schema')
const Cart = require('../schemas/cart.schema')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('../middlewares/auth')

//register user
router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        const userWithEmail = await User.findOne({ email: email });
        if (userWithEmail) {
            return res.status(400).json({ message: "User with email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, phone, email, password: hashedPassword });
        await newUser.save();
        await new Cart({ user: newUser._id }).save()
        return res.status(200).json({ message: "User created successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: error });
    }
});

//login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: "Email or password incorrect" })
        }
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            return res.status(400).json({ message: "Email or password incorrect" })
        }
        const payload = { id: user._id }
        const token = jwt.sign(payload, process.env.JWT_TOKEN)

        return res.status(200).json({ message: `Welcome ${user.name}`, token: token })
    } catch (err) {
        res.status(400).json(err);
    }
})

//Fetch user by id
router.get('/id/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const users = await User.find({ _id: id }).select('-password -__v');
        if (!users.length) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
});

//update user data
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const id = req.user;
        const { name, email, password, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User not found for id: " + id });
        }
        if (newPassword.length) {
            const compare = await bcrypt.compare(password, user.password)
            if (!compare) {
                return res.status(400).json({ message: "Password incorrect" })
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(id, { name, email, password: hashedPassword }, { new: false })
        } else {
            await User.findByIdAndUpdate(id, { name, email }, { new: false })
        }
        res.status(200).json({ message: "User updated successfully!" })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: error });
    }
});

router.patch('/payment-method/update', async (req, res) => {
    const { userId, paymentMethodId, updatedPaymentMethod } = req.body;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const paymentMethod = user.paymentMethods.id(paymentMethodId);

        if (!paymentMethod) {
            return res.status(404).json({ message: "Payment method not found" });
        }

        Object.assign(paymentMethod, updatedPaymentMethod);

        // Ensure only one default payment method
        if (updatedPaymentMethod.default) {
            user.paymentMethods.forEach((method) => {
                if (method._id.toString() !== paymentMethodId) {
                    method.default = false;
                }
            });
        }

        await user.save();
        return res.status(200).json({ message: "Payment method updated successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

// Update delivery address
router.patch('/address/update/:addressId', authMiddleware, async (req, res) => {
    const userId = req.user;
    const { addressId } = req.params;
    const updatedAddress = req.body.updatedAddress;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const address = user.Addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        address.address = updatedAddress.address;
        address.phoneNumber =  updatedAddress.phoneNumber; 
        
        await user.save();

        return res.status(200).json({ message: "Address updated successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

// Add a new address
router.post('/address/add', authMiddleware, async (req, res) => {
    const { newAddress } = req.body;
    const userId = req.user

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // If the new address is marked as default, unset other defaults
        if (newAddress.default) {
            user.Addresses.forEach((addr) => (addr.default = false));
        }

        user.Addresses.push(newAddress);
        await user.save();

        return res.status(201).json({ message: "Address added successfully!", addresses: user.Addresses });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

// Add a new address
router.delete('/address/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // If the new address is marked as default, unset other defaults
        user.Addresses.forEach((addr) => (addr.default = false));

        user.Addresses.remove(id);
        await user.save();

        return res.status(201).json({ message: "Address deleted successfully!", addresses: user.Addresses });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

module.exports = router