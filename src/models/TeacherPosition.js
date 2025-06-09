const mongoose = require('mongoose');

const teacherPositionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  des: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate unique position code before saving
teacherPositionSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  this.code = `POS${year}${month}${randomNum}`;
  
  // Check if code exists
  const exists = await this.constructor.findOne({ code: this.code });
  if (exists) {
    return next(new Error('Failed to generate unique position code. Please try again.'));
  }
  
  next();
});

module.exports = mongoose.model('TeacherPosition', teacherPositionSchema);