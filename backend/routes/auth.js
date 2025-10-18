const express = require('express');
const User = require('../models/User');
const Employee = require('../models/Employee');
const JWTUtil = require('../utils/jwt');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// User Authentication
router.post('/login', async (req, res) => {
  try {
    const { username, password, campus } = req.body;
    
    // Check if it's an employee login
    if (campus === 'employee') {
      const employee = await Employee.findOne({ 
        $or: [{ username }, { id: username }] 
      });
      
      if (employee && employee.password === password) {
        // Generate JWT token for employee
        const token = JWTUtil.generateToken({
          id: employee.id,
          username: employee.username,
          name: employee.name,
          campus: employee.campus,
          type: 'employee',
          role: 'employee'
        });

        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: employee.id,
            username: employee.username,
            name: employee.name,
            campus: employee.campus,
            type: 'employee',
            role: 'employee'
          }
        });
      }
    } else {
      // Admin/User login
      const user = await User.findOne({ username });
      
      if (user && user.password === password && 
          (user.campus === campus || user.role === 'admin' || user.role === 'mudeer')) {
        
        // Generate JWT token for admin/user
        const token = JWTUtil.generateToken({
          id: user._id,
          username: user.username,
          name: user.name,
          campus: user.campus,
          type: 'user',
          role: user.role
        });

        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            username: user.username,
            name: user.name,
            campus: user.campus,
            type: 'user',
            role: user.role
          }
        });
      }
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid username, password, or campus selection'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token endpoint
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;