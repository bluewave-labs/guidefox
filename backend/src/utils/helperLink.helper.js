const { body } = require('express-validator');
const { isValidHexColor } = require('./guide.helper');
const { validateUrl } = require('./link.helper');

const helperValidator = [
  body('title').trim().notEmpty().withMessage('Header is required').isString().withMessage('Invalid value for title'),
  body('headerBackgroundColor')
    .optional()
    .custom(isValidHexColor)
    .withMessage('Invalid value for headerBackgroundColor'),
  body('linkFontColor').optional().custom(isValidHexColor).withMessage('Invalid value for linkFontColor'),
  body('iconColor').optional().custom(isValidHexColor).withMessage('Invalid value for iconColor'),
  body('links').isArray().withMessage('links must be an array'),
  body('links.*.title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('links.*.url')
    .isString()
    .withMessage('link URLs must be a string')
    .custom(validateUrl)
    .withMessage('Invalid value for link URLs'),
  body('links.*.order')
    .optional()
    .isInt()
    .withMessage('Order must be an integer')
    .custom((value) => value >= 0)
    .withMessage('Order must be a positive integer'),
  body('links.*.target').optional().isBoolean().withMessage('Target must be a boolean'),
];

module.exports = {
  helperValidator,
};
