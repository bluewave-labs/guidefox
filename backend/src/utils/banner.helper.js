const { body, param } = require('express-validator');
const settings = require('../../config/settings');
const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const addOrUpdateBannerValidation = [
  body('position')
    .notEmpty()
    .withMessage('Position is required')
    .bail()
    .isIn(settings.banner.position)
    .withMessage('Position must be top or bottom'),
  body('closeButtonAction')
    .notEmpty()
    .withMessage('Close Button Action is required')
    .bail()
    .isIn(settings.banner.action)
    .withMessage('Invalid close button action'),
  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .bail()
    .custom((value) => {
      try {
        new URL(value); // Validates absolute URL
        return true;
      } catch {
        if (value.startsWith('/')) return true; // Allows relative URLs
        throw new Error('URL must be an absolute (http/https) or relative URL (starting with /)');
      }
    }),
  body('actionUrl')
    .optional()
    .custom((value) => {
      if (!value) return true;
      try {
        new URL(value); // Validates absolute URL
        return true;
      } catch {
        if (value.startsWith('/')) return true; // Allows relative URLs
        throw new Error('Action URL must be an absolute (http/https) or relative URL (starting with /)');
      }
    }),
  body('repetitionType').custom((value) => {
    if (!value) {
      throw new Error('Repetition type is required');
    }
    if (!settings.banner.repetition.includes(value)) {
      throw new Error('Invalid repetition type');
    }
    return true;
  }),
  body('backgroundColor')
    .notEmpty()
    .matches(hexColorPattern)
    .withMessage('Background color must be a valid hex color code'),
  body('fontColor').notEmpty().matches(hexColorPattern).withMessage('Font color must be a valid hex color code'),
];

const deleteOrGetBannerByIdValidation = [param('id').notEmpty().trim().isInt().withMessage('Invalid id')];
const getBannerByUrlValidation = [body('url').notEmpty().isString().withMessage('URL is missing or invalid')];

const validatePosition = (value) => {
  const validPositions = settings.banner.position;
  return validPositions.includes(value.toLowerCase());
};

const validatePositionWrapper = (value) => {
  if (!validatePosition(value)) {
    throw new Error('Invalid position');
  }
};

const validateRelativeUrl = (value, fieldName) => {
  if (!value) return;
  try {
    new URL(value);
  } catch (error) {
    if (value.startsWith('/')) {
      return;
    }
    throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
  }
};

const validateUrl = (value, fieldName) => {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }
  } catch (error) {
    throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
  }
};

module.exports = {
  getBannerByUrlValidation,
  deleteOrGetBannerByIdValidation,
  addOrUpdateBannerValidation,
  validatePosition,
  validatePositionWrapper,
  validateUrl,
  validateRelativeUrl,
};
