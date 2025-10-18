const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  campus: { 
    type: String, 
    required: true,
    enum: ['main', 'johar', 'masjid', 'maktab']
  },
  role: { 
    type: String, 
    required: true,
    enum: ['admin', 'user', 'mudeer']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);