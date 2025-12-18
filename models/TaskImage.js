const mongoose = require('mongoose');

const TaskImageSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // optional: link image to task
        required: false
    },
    imageName: {
        type: String, // only image file name or relative path
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'taskimages' // 👈 force collection name
});

module.exports = mongoose.model('TaskImage', TaskImageSchema);
