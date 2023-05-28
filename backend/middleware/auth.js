import jwt from "jsonwebtoken";
import User from "./../models/UserModel.js";

export const protect = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startswith('Bearer ')) {

            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token
            req.user = await User.findOne({ userId: decoded.userId, isAdmin: decoded.isAdmin }).select('-password')
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: "Not authorized" })
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized, no token" })
    }
}