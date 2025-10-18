const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: String,
  timeIn: String,
  timeOut: String,
  lateHours: Number,
  overtime: Number,
  onTime: Boolean,
  status: {
    type: String,
    enum: ['present', 'late', 'absent', 'holiday', 'leave']
  },
  remarks: String
});

const leaveRequestSchema = new mongoose.Schema({
  id: Number,
  type: {
    type: String,
    enum: ['annual', 'casual', 'medical']
  },
  from: String,
  to: String,
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

const performanceReviewSchema = new mongoose.Schema({
  date: String,
  rating: String,
  feedback: String
});

const leavesSchema = new mongoose.Schema({
  annual: {
    total: { type: Number, default: 20 },
    used: { type: Number, default: 0 }
  },
  casual: {
    total: { type: Number, default: 10 },
    used: { type: Number, default: 0 }
  },
  medical: {
    total: { type: Number, default: 15 },
    used: { type: Number, default: 0 }
  }
});

const employeeSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  designation: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  campus: { 
    type: String, 
    required: true,
    enum: ['main', 'johar', 'masjid', 'maktab']
  },
  status: { 
    type: String, 
    required: true,
    enum: ['full_time', 'part_time']
  },
  shiftStart: { 
    type: String, 
    required: true 
  },
  shiftEnd: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  attendance: [attendanceSchema],
  leaves: leavesSchema,
  leaveRequests: [leaveRequestSchema],
  performanceReviews: [performanceReviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);