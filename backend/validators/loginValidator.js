const { body, validationResult } = require('express-validator');

// Email and password validation rules
const validateEmailPassword = [
    // Email validation
    body('email')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
  
    // Password validation
    body('password')
      // .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      // .matches(/\d/).withMessage('Password must contain at least one number')
      // .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      // .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .trim(),
  ];

  // Error handling middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
  
  module.exports = { validateEmailPassword, handleValidationErrors };
