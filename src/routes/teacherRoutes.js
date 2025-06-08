const express = require('express');
const router = express.Router();
const teacherPositionController = require('../controllers/teacherPositionController');

router.get('/', teacherPositionController.getPositions);
router.post('/', teacherPositionController.createPosition);

module.exports = router;