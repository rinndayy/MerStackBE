const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create new user
router.post('/', userController.createUser);

// Check if email exists
router.get('/check-email/:email', userController.checkEmail);

module.exports = router; 