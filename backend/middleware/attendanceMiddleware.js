const Attendance = require('../models/Attendance');

// Validate working hours
const validateWorkingHours = (entryTime, exitTime) => {
  const hours = (exitTime - entryTime) / (1000 * 60 * 60);
  return {
    totalHours: Number(hours.toFixed(2)),
    isComplete: hours >= 8
  };
};

// Check if already marked entry today
exports.checkDailyEntry = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Entry already marked for today'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking daily entry',
      error: error.message
    });
  }
};

// Validate exit time
exports.validateExit = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No entry found for today'
      });
    }

    if (attendance.exitTime) {
      return res.status(400).json({
        success: false,
        message: 'Exit already marked for today'
      });
    }

    // Add attendance record to request for use in controller
    req.attendance = attendance;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating exit',
      error: error.message
    });
  }
};

// Validate date range for history
exports.validateDateRange = (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }

      if (start > end) {
        return res.status(400).json({
          success: false,
          message: 'Start date cannot be after end date'
        });
      }

      // Limit date range to 31 days
      const daysDifference = (end - start) / (1000 * 60 * 60 * 24);
      if (daysDifference > 31) {
        return res.status(400).json({
          success: false,
          message: 'Date range cannot exceed 31 days'
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating date range',
      error: error.message
    });
  }
};

// Validate pagination parameters
exports.validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return res.status(400).json({
      success: false,
      message: 'Page number must be greater than 0'
    });
  }

  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }

  // Add validated pagination params to request
  req.pagination = { page, limit };
  next();
}; 