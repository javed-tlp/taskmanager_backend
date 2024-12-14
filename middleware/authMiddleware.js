const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    // Extract token directly without "Bearer"
    const token = req.headers['authorization'] || req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the user payload to the request object
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = { verifyToken };
