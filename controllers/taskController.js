const Task = require('../models/Task');
const User = require('../models/User'); // Import the User model

// Add a Task
exports.addTask = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        // Fetch the user's name from the User model using req.userId
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new task with the user's name
        const newTask = new Task({
            title,
            description,
            user: req.userId, // Store the user ID
            userName: user.name, // Store the user's name in the task
        });

        await newTask.save();
        res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (err) {
        console.error("Task Creation Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get All Tasks for Logged-in User
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }); // Use req.user._id
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a Task
exports.updateTask = async (req, res) => {
    const { id, title, description } = req.body;

    try {
        let task = await Task.findOne({ _id: id, user: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        await task.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Delete a Task
exports.deleteTask = async (req, res) => {
    const { id } = req.body;  // Task ID from body

    try {
        const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
