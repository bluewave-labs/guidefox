const { internalServerError } = require('./errors.helper');
const { isValidHexColor, checkColorFieldsFail, validateCloseButtonAction } = require("./guide.helper");

const validatePosition = (value) => {
  const validPositions = ["top", "bottom"];
  return validPositions.includes(value.toLowerCase());
};

const validatePositionWrapper = (value) => {
  if (!validatePosition(value)) {
    throw new Error("Invalid position");
  }
};

const validateRelativeUrl = (value, fieldName) => {
  if (!value) return;
  try {
    new URL(value);
  } catch (error) {
    if (value.startsWith('/')) {
      return
    }
    throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
  }
}

const validateUrl = (value, fieldName) => {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("URL must use HTTP or HTTPS protocol");
    }
  } catch (error) {
    throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
  }
};

module.exports = {
  validatePosition,
  validatePositionWrapper,
  validateUrl,
  validateRelativeUrl,
};
