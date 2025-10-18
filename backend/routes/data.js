const express = require('express');
const User = require('../models/User');
const Employee = require('../models/Employee');
const router = express.Router();

// Initialize default data
router.post('/initialize', async (req, res) => {
  try {
    // Default users
    const defaultUsers = [
      { username: "shuja", password: "password1", name: "Shuja Anwar", campus: "main", role: "admin" },
      { username: "haris", password: "password2", name: "Haris Ali", campus: "johar", role: "user" },
      { username: "umair", password: "password3", name: "Umair Aman", campus: "masjid", role: "user" },
      { username: "raid", password: "password4", name: "Raid Ansar", campus: "maktab", role: "user" },
      { username: "mudeer", password: "mudeer123", name: "Maulana Syed Osama Ali", campus: "main", role: "mudeer" }
    ];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        const newUser = new User(userData);
        await newUser.save();
      }
    }

    // Default employees (you can add sample employees here if needed)
    const defaultEmployees = [
      // Add your default employees here
    ];

    for (const empData of defaultEmployees) {
      const existingEmp = await Employee.findOne({ id: empData.id });
      if (!existingEmp) {
        const newEmp = new Employee(empData);
        await newEmp.save();
      }
    }

    res.json({ message: 'Default data initialized successfully' });
  } catch (error) {
    console.error('Error initializing data:', error);
    res.status(500).json({ message: 'Error initializing data' });
  }
});

module.exports = router;