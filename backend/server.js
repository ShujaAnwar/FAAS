const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const userRoutes = require('./routes/users');
const dataRoutes = require('./routes/data');

// Middleware
app.use(express.json());
app.use(require('./middleware/cors'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Fiqh Academy AMS API Server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});