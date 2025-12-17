const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subtask title is required'],
    trim: true,
    maxlength: [200, 'Subtask title cannot exceed 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'study', 'other'],
    default: 'other'
  },
  dueDate: {
    type: Date
  },
  order: {
    type: Number,
    default: 0
  },
  subtasks: [subtaskSchema]
}, {
  timestamps: true
});

// Index for faster queries
todoSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Todo', todoSchema);
