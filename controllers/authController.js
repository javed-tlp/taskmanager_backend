const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load environment variables from .env file
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; // Get the secret from .env

// Register
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        // Directly use the plain password without hashing
        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message: "Register Successfully",
            Success: true, 
            token, 
            user: { id: user._id, name, email }
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
};


// Login
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation Errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        console.log('Login attempt with email:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found with email:", email);
            return res.status(404).json({ error: 'User not found' });
        }

        // Log the entered password and stored password (both plain text)
        console.log("Entered password:", password);
        console.log("Stored password:", user.password);

        // Directly compare the entered password with the stored password
        if (password !== user.password) {
            console.error("Password mismatch for user:", email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("JWT Token Generated:", token);

        res.status(200).json({
            message: "Login Successfully",
            Success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
};





