require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const teacherRoutes = require('./src/routes/teacherRoutes');
const teacherPositionRoutes = require('./src/routes/teacherPositionRoutes');
const loadData = require('./src/data/dataLoader');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher_management';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,  // Timeout nếu không kết nối được trong 5 giây
      socketTimeoutMS: 45000,          // Timeout cho các thao tác query
    });
    console.log('Connected to MongoDB successfully');

    // Load initial data
    await loadData();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Thử kết nối lại sau 5 giây nếu thất bại
    setTimeout(connectDB, 5000);
  }
};

// Kết nối đến MongoDB
connectDB();

// Routes
app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher-positions', teacherPositionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
