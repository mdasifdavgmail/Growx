// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = (role) => {
    return async (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user || user.role !== role) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid token' });
        }
    };
};

module.exports = authMiddleware;
