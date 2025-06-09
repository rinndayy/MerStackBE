const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  }
}, { _id: false });

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  teacherPositions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeacherPosition'
  }],
  degrees: [degreeSchema]
}, {
  timestamps: true
});

// Generate unique teacher code before saving
teacherSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  this.code = `T${year}${month}${randomNum}`;
  
  // Check if code exists
  const exists = await this.constructor.findOne({ code: this.code });
  if (exists) {
    return next(new Error('Failed to generate unique teacher code. Please try again.'));
  }
  
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);