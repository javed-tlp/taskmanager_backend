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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: 'success', // Status indicating success
            message: 'Login successful', // Success message
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
};
