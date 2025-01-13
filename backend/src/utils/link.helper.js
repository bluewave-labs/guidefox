const { body, param, query } = require('express-validator');

const URL_REGEX =
  /(?:https?:\/\/(?:www\.)?|www\.)?[a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-\d@:%_+.~#?&//=]*)|(?:\/[a-zA-Z0-9@:%._+~#&//=]*)/gi;

const RELATIVE_URL_REGEX = /^\/([a-zA-Z0-9_-]+\/?)+$/;

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return RELATIVE_URL_REGEX.test(url);
  }
};

const linkValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
  body('url').isString().withMessage('URL must be a string').custom(validateUrl).withMessage('Invalid value for URL'),
  body('order')
    .optional()
    .isInt()
    .withMessage('Order must be an integer')
    .custom((value) => value >= 0)
    .withMessage('Order must be a positive integer'),
  body('helperId').isInt().withMessage('Helper ID is required and must be an integer'),
  body('target').optional().isBoolean().withMessage('Target must be a boolean'),
];

const idParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .custom((value) => /\d+/.test(value))
    .withMessage('ID must be an integer'),
];

const queryValidator = [
  query('helperId')
    .notEmpty()
    .withMessage('Helper ID is required')
    .custom((value) => /\d+/.test(value))
    .withMessage('Helper ID must be an integer'),
];

const bodyUrlValidator = [
  body('url').isString().withMessage('URL must be a string').custom(validateUrl).withMessage('Invalid value for URL'),
];

module.exports = {
  URL_REGEX,
  RELATIVE_URL_REGEX,
  validateUrl,
  linkValidator,
  idParamValidator,
  queryValidator,
  bodyUrlValidator,
};
