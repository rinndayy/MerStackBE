const Teacher = require('../models/Teacher');
const User = require('../models/User');
const TeacherPosition = require('../models/TeacherPosition');

// Helper function to convert MongoDB _id to string id
const convertIdToString = (obj) => {
  if (!obj) return obj;
  
  const converted = { ...obj };
  if (converted._id) {
    converted.id = converted._id.toString();
    delete converted._id;
  }
  return converted;
};

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId')
      .populate('teacherPositions');
    
    const convertedTeachers = teachers.map(teacher => {
      const teacherObj = teacher.toObject();
      return convertIdToString(teacherObj);
    });

    res.json({
      success: true,
      data: convertedTeachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId')
      .populate('teacherPositions');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const convertedTeacher = convertIdToString(teacher.toObject());

    res.json({
      success: true,
      data: convertedTeacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher',
      error: error.message
    });
  }
};

// Create new teacher
exports.createTeacher = async (req, res) => {
  try {
    // Create user first
    const user = new User({
      ...req.body.user,
      role: 'TEACHER'
    });
    await user.save();

    // Create teacher with user reference
    const teacher = new Teacher({
      userId: user._id,
      code: req.body.code,
      startDate: req.body.startDate,
      teacherPositions: req.body.teacherPositions,
      degrees: req.body.degrees,
      isActive: true
    });
    await teacher.save();

    // Populate the teacher data
    await teacher.populate('userId');
    await teacher.populate('teacherPositions');

    const convertedTeacher = convertIdToString(teacher.toObject());

    res.status(201).json({
      success: true,
      data: convertedTeacher
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating teacher',
      error: error.message
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Soft delete
    teacher.isDeleted = true;
    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: error.message
    });
  }
};

// Lấy tất cả vị trí (chưa bị xóa)
exports.getPositions = async (req, res) => {
  try {
    const positions = await TeacherPosition.find({ isDeleted: false });
    
    const convertedPositions = positions.map(pos => convertIdToString(pos.toObject()));

    res.json({
      success: true,
      data: convertedPositions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching positions',
      error: error.message
    });
  }
};

// Tạo vị trí mới
exports.createPosition = async (req, res) => {
  try {
    const position = new TeacherPosition(req.body);
    await position.save();

    const convertedPosition = convertIdToString(position.toObject());

    res.status(201).json({
      success: true,
      data: convertedPosition
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating position',
      error: error.message
    });
  }
};

// Lấy vị trí theo ID
exports.getPositionById = async (req, res) => {
  try {
    const position = await TeacherPosition.findById(req.params.id);
    
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    const convertedPosition = convertIdToString(position.toObject());

    res.json({
      success: true,
      data: convertedPosition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching position',
      error: error.message
    });
  }
};