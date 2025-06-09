const User = require('../models/User');

// Create new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Check if email exists
exports.checkEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    res.json({
      success: true,
      exists: !!user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking email',
      error: error.message
    });
  }
}; 