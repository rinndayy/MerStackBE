require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const teacherRoutes = require('./src/routes/teacherRoutes');
const teacherPositionRoutes = require('./src/routes/teacherPositionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const loadData = require('./src/data/dataLoader');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher_management';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
    await loadData();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    setTimeout(connectDB, 5000);
  }
};

// Routes
app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher-positions', teacherPositionRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});