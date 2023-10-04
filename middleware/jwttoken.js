// jwtMiddleware.js

const jwt = require('jsonwebtoken');
// const secret_key="YourSecretKeyHere"
const { secretKey } = require('../controllers/config');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Missing Authorization token ' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: error.message+"  error" });
    }
};

module.exports = verifyToken;
