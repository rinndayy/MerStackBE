const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; // Lưu URI vào .env
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB Atlas');

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
