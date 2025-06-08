const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Import models
const TeacherPosition = require('../models/TeacherPosition');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

async function loadData() {
  try {
    // Read JSON files
    const teacherPositionsData = JSON.parse(
      await fs.readFile(path.join(__dirname, 'school.teacherposition.json'), 'utf8')
    );
    const teachersData = JSON.parse(
      await fs.readFile(path.join(__dirname, 'school.teacher.json'), 'utf8')
    );
    const usersData = JSON.parse(
      await fs.readFile(path.join(__dirname, 'school.user.json'), 'utf8')
    );

    // Transform teacher positions data
    const transformedTeacherPositions = teacherPositionsData.map(pos => ({
      _id: new mongoose.Types.ObjectId(pos._id.$oid),
      name: pos.name,
      code: pos.code,
      des: pos.des,
      isActive: true,
      isDeleted: false,
      createdAt: new Date(pos.createdAt.$date),
      updatedAt: new Date(pos.updatedAt.$date)
    }));

    // Transform users data - filter only TEACHER role
    const transformedUsers = usersData
      .filter(user => user.role === 'TEACHER')
      .map(user => ({
        _id: new mongoose.Types.ObjectId(user._id.$oid),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        identity: user.identity,
        dob: user.dob ? new Date(user.dob.$date) : new Date(),
        role: 'TEACHER',
        isDeleted: false,
        createdAt: user.createdAt ? new Date(user.createdAt.$date) : new Date(),
        updatedAt: user.updatedAt ? new Date(user.updatedAt.$date) : new Date()
      }));

    // Transform teachers data - không lọc isDeleted
    const transformedTeachers = teachersData.map(teacher => {
      // Map degrees with proper structure
      const degrees = teacher.degrees.map(degree => ({
        name: degree.type || 'Bachelor',
        institution: degree.school || 'Unknown',
        graduationYear: degree.year || new Date().getFullYear()
      }));

      return {
        _id: new mongoose.Types.ObjectId(teacher._id.$oid),
        userId: new mongoose.Types.ObjectId(teacher.userId.$oid),
        code: teacher.code,
        isActive: true,
        isDeleted: false, // Set isDeleted to false for all teachers
        startDate: new Date(teacher.startDate.$date),
        endDate: teacher.endDate ? new Date(teacher.endDate.$date) : undefined,
        teacherPositions: teacher.teacherPositionsId?.map(pos => 
          new mongoose.Types.ObjectId(pos.$oid)
        ) || [],
        degrees: degrees,
        createdAt: new Date(teacher.createdAt.$date),
        updatedAt: new Date(teacher.updatedAt.$date)
      };
    });

    // Clear existing data
    await TeacherPosition.deleteMany({});
    await Teacher.deleteMany({});
    await User.deleteMany({});

    // Insert new data
    await TeacherPosition.insertMany(transformedTeacherPositions);
    await User.insertMany(transformedUsers);
    await Teacher.insertMany(transformedTeachers);

    console.log('Data loaded successfully!');
    console.log(`Loaded ${transformedTeacherPositions.length} positions`);
    console.log(`Loaded ${transformedUsers.length} users`);
    console.log(`Loaded ${transformedTeachers.length} teachers`);
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

module.exports = loadData; 