const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Mark entry time
exports.markEntry = async (req, res) => {
  try {
    // Create new attendance record
    const attendance = await Attendance.create({
      userId: req.user._id,
      date: new Date(),
      entryTime: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Entry marked successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking entry',
      error: error.message
    });
  }
};

// Mark exit time
exports.markExit = async (req, res) => {
  try {
    const attendance = req.attendance; // Get attendance from middleware
    attendance.exitTime = new Date();
    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Exit marked successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking exit',
      error: error.message
    });
  }
};

// Get today's attendance
exports.getTodayAttendance = async (req, res) => {
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

    res.status(200).json({
      success: true,
      data: attendance || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s attendance',
      error: error.message
    });
  }
};

// Get attendance history
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    let query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: attendance,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance history',
      error: error.message
    });
  }
}; 