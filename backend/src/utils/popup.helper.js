const settings = require('../../config/settings');

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
  validatePopupSize,
  validatePopupSizeWrapper,
  validateUrl,
  validateRelativeUrl,
};
