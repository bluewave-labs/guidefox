const isValidHexColor = (value) => {
  const hexColorRegex =
    /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexColorRegex.test(value);
};

const validateHexColor = (value, fieldName) => {
  if (!isValidHexColor(value)) {
    throw new Error(`${fieldName} must be a valid hex color code`);
  }
};

const checkColorFieldsFail = (colorFields, res) => {
  const errors = [];
  for (const [field, value] of Object.entries(colorFields)) {
    if (value && !isValidHexColor(value)) {
      errors.push({ msg: `${field} must be a valid hex color code` });
    }
  }
  return errors.length > 0 ? errors : false;
};

const validateCloseButtonAction = (value) => {
  const validActions = ["no action", "open url", "open url in a new tab"];
  return validActions.includes(value);
};

const validateActionButton = (value) => {
  if (!validateCloseButtonAction(value)) {
    throw new Error("Invalid close button action");
  }
};

module.exports = {
  isValidHexColor,
  validateHexColor,
  checkColorFieldsFail,
  validateCloseButtonAction,
  validateActionButton,
};
