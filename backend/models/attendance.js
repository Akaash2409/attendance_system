const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date,
    default: null
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['complete', 'incomplete'],
    default: 'incomplete'
  }
}, {
  timestamps: true
});

// Index for faster queries
attendanceSchema.index({ userId: 1, date: 1 });

// Calculate total hours when exit time is marked
attendanceSchema.pre('save', function(next) {
  if (this.exitTime && this.entryTime) {
    const hours = (this.exitTime - this.entryTime) / (1000 * 60 * 60);
    this.totalHours = Number(hours.toFixed(2));
    this.status = this.totalHours >= 8 ? 'complete' : 'incomplete';
  }
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;