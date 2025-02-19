const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Placeholder routes - we'll implement the controllers later
router.get('/attendance', auth, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Get all attendance - to be implemented' });
});

router.get('/queries', auth, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Get all queries - to be implemented' });
});

router.get('/users', auth, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Get all users - to be implemented' });
});

module.exports = router; 