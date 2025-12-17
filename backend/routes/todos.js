const express = require('express');
const { body, validationResult } = require('express-validator');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/todos
// @desc    Get all todos for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId })
      .sort({ order: 1, createdAt: -1 });
    
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// @route   GET /api/todos/:id
// @desc    Get single todo
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ message: 'Error fetching todo' });
  }
});

// @route   POST /api/todos
// @desc    Create new todo
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('category').optional().isIn(['work', 'personal', 'study', 'other']).withMessage('Invalid category'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, category, dueDate } = req.body;

    const todo = new Todo({
      user: req.userId,
      title,
      description,
      priority,
      category,
      dueDate
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Error creating todo' });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('category').optional().isIn(['work', 'personal', 'study', 'other']).withMessage('Invalid category'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, completed, priority, category, dueDate } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
        $set: { 
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { completed }),
          ...(priority !== undefined && { priority }),
          ...(category !== undefined && { category }),
          ...(dueDate !== undefined && { dueDate })
        }
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion
// @access  Private
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ message: 'Error toggling todo' });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

// @route   DELETE /api/todos
// @desc    Delete all completed todos
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ 
      user: req.userId,
      completed: true 
    });

    res.json({ 
      message: `${result.deletedCount} completed todos deleted` 
    });
  } catch (error) {
    console.error('Delete completed todos error:', error);
    res.status(500).json({ message: 'Error deleting todos' });
  }
});

// @route   PATCH /api/todos/reorder
// @desc    Reorder todos
// @access  Private
router.patch('/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array' });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user: req.userId },
        update: { $set: { order: index } }
      }
    }));

    await Todo.bulkWrite(bulkOps);
    
    const todos = await Todo.find({ user: req.userId })
      .sort({ order: 1, createdAt: -1 });
    
    res.json(todos);
  } catch (error) {
    console.error('Reorder todos error:', error);
    res.status(500).json({ message: 'Error reordering todos' });
  }
});

// @route   POST /api/todos/:id/subtasks
// @desc    Add subtask to todo
// @access  Private
router.post('/:id/subtasks', [
  body('title').trim().notEmpty().withMessage('Subtask title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.subtasks.push({ title: req.body.title });
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Add subtask error:', error);
    res.status(500).json({ message: 'Error adding subtask' });
  }
});

// @route   PATCH /api/todos/:id/subtasks/:subtaskId/toggle
// @desc    Toggle subtask completion
// @access  Private
router.patch('/:id/subtasks/:subtaskId/toggle', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const subtask = todo.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    subtask.completed = !subtask.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Toggle subtask error:', error);
    res.status(500).json({ message: 'Error toggling subtask' });
  }
});

// @route   DELETE /api/todos/:id/subtasks/:subtaskId
// @desc    Delete subtask
// @access  Private
router.delete('/:id/subtasks/:subtaskId', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.subtasks.pull(req.params.subtaskId);
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Delete subtask error:', error);
    res.status(500).json({ message: 'Error deleting subtask' });
  }
});

module.exports = router;
