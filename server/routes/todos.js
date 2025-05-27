const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// GET all todos for logged in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new todo
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    const todo = new Todo({ userId: req.user._id, text, completed: false });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update todo by id
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { text, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE todo by id
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
