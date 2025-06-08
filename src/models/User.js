const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  identity: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: Date,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['STUDENT', 'TEACHER', 'ADMIN'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
