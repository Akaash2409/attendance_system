const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  markEntry,
  markExit,
  getTodayAttendance,
  getAttendanceHistory
} = require('../controllers/attendanceController');

const {
  checkDailyEntry,
  validateExit,
  validateDateRange,
  validatePagination
} = require('../middleware/attendanceMiddleware');

// Mark attendance routes
router.post('/mark-entry', auth, checkDailyEntry, markEntry);
router.post('/mark-exit', auth, validateExit, markExit);

// Get attendance routes
router.get('/today', auth, getTodayAttendance);
router.get('/history', auth, validateDateRange, validatePagination, getAttendanceHistory);

module.exports = router; 