const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true); // Avoids deprecated warnings for query filters
        const conn = await mongoose.connect(process.env.MONGO_URI); // No options passed
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
