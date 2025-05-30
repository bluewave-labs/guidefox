const { body, param } = require('express-validator');
const settings = require('../../config/settings');
const hexColorPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

const colorValidator = (field) => {
  return body(field).optional().matches(hexColorPattern).withMessage(`${field} must be a valid hex color code`)
}

const addOrUpdatePopupValidation = [
  body('popupSize')
    .notEmpty()
    .withMessage('Popup size is required')
    .bail()
    .isIn(settings.popup.size)
    .withMessage('Invalid value for Popup size'),
  body('closeButtonAction').notEmpty()
    .withMessage('Close Button Action is required')
    .bail()
    .isIn(settings.popup.action)
    .withMessage('Invalid close button action'),
  body('repetitionType')
    .notEmpty()
    .withMessage('Repetition type is required')
    .bail()
    .isIn(settings.popup.repetition)
    .withMessage('Invalid repetition type'),
  body('url')
    .custom((value, {req}) => {
      const needsUrl = ['open url', 'open url in a new tab'].includes(req.body.closeButtonAction);
      return !needsUrl || (needsUrl && value)
    })
    .withMessage('URL is required when close button action is set to open URL')
    .bail()
    .custom((value) => {
      if (!value || value.startsWith('/')) return true;
      try {
        const url = new URL(value)
        return ['http:', 'https:'].includes(url.protocol);
      }
      catch(error) {
        return false
      }
    })
    .withMessage('Invalid URL. URL must start with / or use HTTP or HTTPS protocol'),
  body('actionButtonUrl')
    .custom((value) => {
      if(!value) return true;
      try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol)
      }catch(error) {
        return false
      }
    })
    .withMessage('Invalid URL. Action URL must use HTTP or HTTPS protocol'),
    colorValidator('headerBackgroundColor'),
    colorValidator('headerColor'),
    colorValidator('textColor'),
    colorValidator('buttonBackgroundColor'),
    colorValidator('buttonTextColor'),
]

const deleteOrGetPopupByIdValidation = [
  param('id')
    .notEmpty()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Invalid popup id")
]

const getPopupByUrlValidation = [
  body('url')
    .notEmpty()
    .isString()
    .withMessage('URL is missing or invalid')
]

const validatePopupSize = (value) => {
  const validSizes = settings.popup.size;
  return validSizes.includes(value);
};

const validatePopupSizeWrapper = (value) => {
  if (!validatePopupSize(value)) {
    throw new Error('Invalid popup size');
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
  addOrUpdatePopupValidation,
  deleteOrGetPopupByIdValidation,
  getPopupByUrlValidation,
  validatePopupSize,
  validatePopupSizeWrapper,
  validateUrl,
  validateRelativeUrl,
};
