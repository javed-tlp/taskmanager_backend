const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Import the DB connection function
const apiRoutes = require('./routes/api');  // Import the unified API route handler

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes - Using the unified api.js route handler
app.use('/api', apiRoutes);  // All routes will be under /api, e.g., /api/auth, /api/tasks

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
