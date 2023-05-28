import bcrypt from "bcrypt"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/UserModel.js";

//@desc Register a new user
//@route POST /api/users/register
//@access  Public
export const register = asyncHandler(async (req, res) => {
    const { username, email, password, isAdmin } = req.body

    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please enter a username and email or password")
    }

    // Check if user exists already
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    // Create user 
    const user = await User.create({ username, email, password: hashPassword, isAdmin })

    res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin,
        token: generateAdminToken(user)
    })
})

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })

    if(!username || !password) {
        res.status(404).json({ message: 'Please enter your username or password'})
    }
    if (username && bcrypt.compare(password, user.password)) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateAdminToken(user)
        })
    } else {
        res.status(404).json({ message: 'User not found' })
    }

})

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 })

    res.status(200).json({
        status: 'success',
        total: users.length,
        users
    })
})

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            res.status(404).json({ message: `User with id ${req.params.id} is not found` });
        }

        res.status(200).json({ message: `User with id ${req.params.id} was removed` })
    } catch (error) {
        res.status(404).json({ message: `User with id ${req.params.id} is not found` });
    }
}

export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(user);
});


const generateAdminToken = (user) => {
    return jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}
