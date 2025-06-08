const Teacher = require('../models/Teacher');
const User = require('../models/User');

// Hàm chuyển đổi _id thành chuỗi cho toàn bộ object
const convertIdToString = (obj) => {
  if (!obj) return obj;
  
  const converted = { ...obj };
  if (converted._id) {
    converted.id = converted._id.toString();
    delete converted._id;
  }
  
  // Chuyển đổi các trường tham chiếu
  if (converted.userId && typeof converted.userId === 'object') {
    converted.userId = {
      ...converted.userId,
      id: converted.userId._id ? converted.userId._id.toString() : null
    };
    if (converted.userId._id) delete converted.userId._id;
  }

  if (Array.isArray(converted.teacherPositionsId)) {
    converted.teacherPositionsId = converted.teacherPositionsId.map(pos => 
      typeof pos === 'object' && pos._id ? pos._id.toString() : pos
    );
  }

  if (Array.isArray(converted.degrees)) {
    converted.degrees = converted.degrees.map(degree => {
      if (degree && degree._id) {
        const degreeObj = { ...degree };
        degreeObj.id = degree._id.toString();
        delete degreeObj._id;
        return degreeObj;
      }
      return degree;
    });
  }

  return converted;
};

// Get all teachers with pagination
exports.getTeachers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // First, get all active teachers
    const query = { isDeleted: false };

    // Get total count first
    const total = await Teacher.countDocuments(query);

    // Then get paginated data with populated fields
    const teachers = await Teacher.find(query)
      .populate({
        path: 'userId',
        select: 'name email phoneNumber address identity dob',
        match: { isDeleted: false }
      })
      .populate({
        path: 'teacherPositions',
        select: 'name code des',
        match: { isDeleted: false }
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .lean();

    // Format response data
    const formattedTeachers = teachers.map(teacher => ({
      code: teacher.code,
      name: teacher.userId?.name,
      email: teacher.userId?.email,
      phoneNumber: teacher.userId?.phoneNumber,
      address: teacher.userId?.address,
      identity: teacher.userId?.identity,
      dob: teacher.userId?.dob,
      isActive: teacher.isActive,
      positions: teacher.teacherPositions?.map(pos => ({
        code: pos.code,
        name: pos.name,
        description: pos.des
      })),
      degrees: teacher.degrees?.map(degree => ({
        type: degree.name,
        school: degree.institution,
        graduationYear: degree.graduationYear
      }))
    }));

    // Calculate pagination values
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: formattedTeachers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error in getTeachers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Create new teacher
exports.createTeacher = async (req, res) => {
  try {
    const { user: userData, ...teacherData } = req.body;

    // Create user first
    const user = new User(userData);
    await user.save();

    // Create teacher with reference to user
    const teacher = new Teacher({
      ...teacherData,
      userId: user._id
    });
    await teacher.save();

    // Populate references and convert to object
    await teacher.populate('userId');
    await teacher.populate('teacherPositionsId');

    // Chuyển đổi _id thành chuỗi
    const convertedTeacher = convertIdToString(teacher.toObject());

    res.status(201).json({
      success: true,
      data: convertedTeacher
    });
  } catch (error) {
    console.error('Error in createTeacher:', error);
    
    // If user was created but teacher creation failed, delete the user
    if (error.userId) {
      await User.findByIdAndDelete(error.userId);
    }

    res.status(400).json({
      success: false,
      message: 'Error creating teacher',
      error: error.message
    });
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId')
      .populate('teacherPositionsId');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Chuyển đổi _id thành chuỗi
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
