const express = require('express');
const Employee = require('../models/Employee');
const { authMiddleware } = require('../middleware/auth'); // Add this


// Protect all routes with JWT
const router = express.Router();
router.use(authMiddleware);

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Error fetching employee' });
  }
});

// Create or update employee
router.post('/', async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Check if employee exists
    const existingEmployee = await Employee.findOne({ id: employeeData.id });
    
    if (existingEmployee) {
      // Update existing employee
      const updatedEmployee = await Employee.findOneAndUpdate(
        { id: employeeData.id },
        employeeData,
        { new: true, runValidators: true }
      );
      res.json(updatedEmployee);
    } else {
      // Create new employee
      const newEmployee = new Employee(employeeData);
      await newEmployee.save();
      res.status(201).json(newEmployee);
    }
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ message: 'Error saving employee' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

// Update employee attendance
router.post('/:id/attendance', async (req, res) => {
  try {
    const { date, timeIn, timeOut, status, remarks, lateHours, overtime, onTime } = req.body;
    
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Find existing attendance record for the date
    const existingRecordIndex = employee.attendance.findIndex(record => record.date === date);
    
    if (existingRecordIndex !== -1) {
      // Update existing record
      employee.attendance[existingRecordIndex] = {
        date,
        timeIn: timeIn || employee.attendance[existingRecordIndex].timeIn,
        timeOut: timeOut || employee.attendance[existingRecordIndex].timeOut,
        status: status || employee.attendance[existingRecordIndex].status,
        remarks: remarks || employee.attendance[existingRecordIndex].remarks,
        lateHours: lateHours || employee.attendance[existingRecordIndex].lateHours,
        overtime: overtime || employee.attendance[existingRecordIndex].overtime,
        onTime: onTime !== undefined ? onTime : employee.attendance[existingRecordIndex].onTime
      };
    } else {
      // Create new record
      employee.attendance.push({
        date,
        timeIn,
        timeOut,
        status,
        remarks,
        lateHours: lateHours || 0,
        overtime: overtime || 0,
        onTime: onTime || false
      });
    }
    
    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance' });
  }
});

// Update employee leaves
router.post('/:id/leaves', async (req, res) => {
  try {
    const { leaves } = req.body;
    
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    employee.leaves = leaves;
    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error('Error updating leaves:', error);
    res.status(500).json({ message: 'Error updating leaves' });
  }
});

// Add leave request
router.post('/:id/leave-requests', async (req, res) => {
  try {
    const { type, from, to, reason } = req.body;
    
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const newRequest = {
      id: Date.now(),
      type,
      from,
      to,
      reason,
      status: 'pending'
    };
    
    employee.leaveRequests.push(newRequest);
    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error('Error adding leave request:', error);
    res.status(500).json({ message: 'Error adding leave request' });
  }
});

// Update leave request status
router.put('/:id/leave-requests/:requestId', async (req, res) => {
  try {
    const { status } = req.body;
    
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const request = employee.leaveRequests.find(req => req.id == req.params.requestId);
    if (!request) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    request.status = status;
    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({ message: 'Error updating leave request' });
  }
});

module.exports = router;