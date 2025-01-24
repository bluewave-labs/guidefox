const { body, param } = require('express-validator');
const { isValidHexColor } = require('./guide.helper');
const { validateUrl } = require('./link.helper');
const settings = require('../../config/settings');

const createColorValidator = (fieldName) =>
  body(fieldName).optional().isString().custom(isValidHexColor).withMessage(`Invalid value for ${fieldName}`);

const hintValidator = [
  body('action')
    .isString()
    .notEmpty()
    .withMessage('action is required')
    .custom((value) => {
      return settings.hint.action.includes(value);
    })
    .withMessage('Invalid value for action'),
  createColorValidator('headerBackgroundColor'),
  createColorValidator('headerColor'),
  createColorValidator('textColor'),
  createColorValidator('buttonBackgroundColor'),
  createColorValidator('buttonTextColor'),
  body('repetitionType')
    .isString()
    .notEmpty()
    .withMessage('RepetitionType is required')
    .custom((value) => {
      return settings.hint.repetition.includes(value);
    })
    .withMessage('Invalid value for repetitionType'),
  body('url')
    .optional()
    .isString()
    .withMessage('link URLs must be a string')
    .custom(validateUrl)
    .withMessage('Invalid value for link URLs'),
  body('actionButtonUrl')
    .optional()
    .isString()
    .withMessage('actionButtonUrl must be a string')
    .custom(validateUrl)
    .withMessage('Invalid value for actionButtonUrl'),
  body('actionButtonText').optional().isString().withMessage('actionButtonText must be a string'),
  body('targetElement').optional().isString().withMessage('targetElement must be a string'),
  body('tooltipPlacement')
    .notEmpty()
    .withMessage('tooltipPlacement is required')
    .isString()
    .isIn(settings.hint.tooltipPlacement)
    .withMessage('Invalid value for tooltipPlacement'),
  body('hintContent').optional().isString().withMessage('Invalid value for hintContent'),
  body('header').optional().isString().withMessage('Invalid value for header'),
];

const paramIdValidator = [
  param('hintId').notEmpty().withMessage('hintId is required').isInt().withMessage('Invalid hint ID'),
];

const bodyUrlValidator = [body('url').notEmpty().withMessage('url is required').isURL().withMessage('Invalid URL')];

module.exports = { hintValidator, paramIdValidator, bodyUrlValidator };
