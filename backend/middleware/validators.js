const validator = require('validator');

exports.validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Validate name
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Validate email
  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Validate password
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password) {
    errors.push('Please provide a password');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}; 