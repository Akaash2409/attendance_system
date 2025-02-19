const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    trim: true,
    minlength: [2],
    maxlength: [50]
  },
  email: {
    type: String,
    required: [true],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail]
  },
  password: {
    type: String,
    required: [true],
    minlength: [8],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: {
      values: ['employee', 'admin'],
      message: 'Role must be either: employee or admin'
    },
    default: 'employee'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true // Automatically handle createdAt and updatedAt
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Method to check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Create indexes
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 