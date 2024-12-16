const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/authMiddleware');
const {
    addTask,
    getAllTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const {
    register,
    login
} = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/register', [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').not().isEmpty().withMessage('Password is required')
], login);

// Task routes using POST
router.post('/add', verifyToken, addTask); // Add a task
router.post('/getall', verifyToken, getAllTasks); // Get all tasks (moved to POST)
router.post('/update', verifyToken, [
    body('id').not().isEmpty().withMessage('Task ID is required'),
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('Description is required')
], updateTask); // Update a task (using POST with body)

router.post('/delete', verifyToken, [
    body('id').not().isEmpty().withMessage('Task ID is required')
], deleteTask); // Delete a task (using POST with body)

module.exports = router;
