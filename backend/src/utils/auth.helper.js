const { body } = require('express-validator');
const PASSWORD_SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>_\-=]/;
const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .matches(/^[A-Za-z'\s-]+$/)
    .withMessage('Name can only contain letters, hyphens and apostrophes'),
  body('surname')
    .notEmpty()
    .withMessage('Surname is required')
    .matches(/^[A-Za-z'\s-]+$/)
    .withMessage('Name can only contain letters, hyphens and apostrophes'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters')
    .matches(PASSWORD_SPECIAL_CHARS)
    .withMessage('Must contain one special character'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgetPasswordValidation = [body('email').isEmail().withMessage('Invalid email address')];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Must be atleast 8 characters')
    .matches(PASSWORD_SPECIAL_CHARS)
    .withMessage('Must contain one special character'),
];

const decode = (str) => {
  const isBase64 = /^data:image\/[a-zA-Z]+;base64,/.test(str);
  try {
    if (isBase64) {
      return Buffer.from(str, 'base64').toString('utf-8');
    } else {
      return decodeURIComponent(str);
    }
  } catch {
    return str;
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
  decode,
};
