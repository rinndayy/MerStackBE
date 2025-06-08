const TeacherPosition = require('../models/TeacherPosition');

// Hàm chuyển đổi _id thành chuỗi id
const convertIdToString = (obj) => {
  if (!obj) return obj;
  
  const converted = { ...obj };
  if (converted._id) {
    converted.id = converted._id.toString();
    delete converted._id;
  }
  return converted;
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
