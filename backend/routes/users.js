const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth'); // Add this

// Protect all routes with JWT
const router = express.Router();
router.use(authMiddleware);

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Create or update user
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username: userData.username });
    
    if (existingUser) {
      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { username: userData.username },
        userData,
        { new: true, runValidators: true }
      );
      res.json(updatedUser);
    } else {
      // Create new user
      const newUser = new User(userData);
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user' });
  }
});

// Delete user
router.delete('/:username', async (req, res) => {
  try {
    await User.findOneAndDelete({ username: req.params.username });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;