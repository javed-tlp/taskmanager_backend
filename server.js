const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');  // ← add this
const connectDB = require('./config/db');  
const apiRoutes = require('./routes/api');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ← add this

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
