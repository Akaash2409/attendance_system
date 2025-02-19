const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validators');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.post('/logout', auth, logout);

module.exports = router; 