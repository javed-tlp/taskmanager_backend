const express = require('express');
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Add a Task
router.post('/add', verifyToken, async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const newTask = new Task({
            title,
            description,
            user: req.userId, // Use req.userId instead of req.user.id
        });

        await newTask.save();
        res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (err) {
        console.error("Task Creation Error:", err); // Log error for debugging
        res.status(500).json({ error: 'Server error' });
    }
});


// Get All Tasks for Logged-in User
router.get('/getall', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); // Fetch only the tasks of the logged-in user
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a Task
router.put('/update/:id', verifyToken, async (req, res) => {
    const { title, description } = req.body;

    try {
        let task = await Task.findOne({ _id: req.params.id, user: req.user.id }); // Ensure task belongs to the logged-in user
        if (!task) return res.status(404).json({ error: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        await task.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a Task
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Ensure task belongs to the logged-in user
        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
