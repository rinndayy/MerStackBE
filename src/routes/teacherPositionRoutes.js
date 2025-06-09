const express = require('express');
const router = express.Router();
const teacherPositionController = require('../controllers/teacherPositionController');

// GET /api/teacher-positions - Get all positions
router.get('/', teacherPositionController.getPositions);

// GET /api/teacher-positions/:id - Get position by ID
router.get('/:id', teacherPositionController.getPositionById);

// POST /api/teacher-positions - Create a new position
router.post('/', teacherPositionController.createPosition);

module.exports = router;