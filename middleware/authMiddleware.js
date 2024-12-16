const jwt = require('jsonwebtoken');
require('dotenv').config();  // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET;  // Get the secret from .env

exports.verifyToken = (req, res, next) => {
    console.log("Step 1: Entered verifyToken middleware");

    // Get the token from the authorization header
    const token = req.headers['authorization'];  
    console.log("Step 2: Received Authorization Header:", req.headers['authorization']);

    if (!token) {
        console.error("Step 3: Token not provided in the header");
        return res.status(403).json({ error: 'No token provided' });
    }

    // Remove the 'Bearer ' prefix if it exists
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    console.log("Step 4: Cleaned Token (without Bearer prefix):", cleanToken);  // Log cleaned token

    // Verify the JWT
    jwt.verify(cleanToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Step 5: JWT Verification Error:', err.message);  // Log detailed error
            return res.status(401).json({ error: 'Unauthorized! Invalid token.' });
        }

        console.log("Step 6: JWT Verified Successfully. Decoded payload:", decoded);  // Log decoded token

        req.userId = decoded.id;  // Attach decoded userId to the request object
        console.log("Step 7: Attaching decoded userId to req.userId:", req.userId);

        next();  // Continue to the next middleware or route handler
    });
};
