const { internalServerError } = require("./errors.helper");
const {
  isValidHexColor,
  checkColorFieldsFail,
  validateCloseButtonAction,
} = require("./guide.helper");

// const validatePosition = (value) => {
//   const validPositions = ["top", "bottom"];
//   return validPositions.includes(value.toLowerCase());
// };

// const validatePositionWrapper = (value) => {
//   if (!validatePosition(value)) {
//     throw new Error("Invalid position");
//   }
// };

// const validateRelativeUrl = (value, fieldName) => {
//   if (!value) return;
//   try {
//     new URL(value);
//   } catch (error) {
//     if (value.startsWith('/')) {
//       return
//     }
//     throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
//   }
// }

// const validateUrl = (value, fieldName) => {
//   if (!value) return;
//   try {
//     const url = new URL(value);
//     if (!["http:", "https:"].includes(url.protocol)) {
//       throw new Error("URL must use HTTP or HTTPS protocol");
//     }
//   } catch (error) {
//     throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
//   }
// };

const validatePosition = (value) => {
  const validPositions = ["top", "bottom"];
  return validPositions.includes(value.toLowerCase());
};

const validatePositionWrapper = (value) => {
  if (!validatePosition(value)) {
    return [{ msg: "Invalid position" }];
  }
  return null;
};

const validateId = (id) => {
  if (Number.isNaN(Number(id)) || !id || id.trim() === "") {
    return [{ msg: "Invalid id" }];
  }
  return null;
};

const validateRelativeUrl = (value, fieldName) => {
  if (!value) return;
  try {
    new URL(value);
  } catch (error) {
    if (value.startsWith("/")) {
      return;
    }
    return [{ msg: `${error.message}` }];
  }
};

const validateUrl = (value) => {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return [{ msg: "URL must use HTTP or HTTPS protocol" }];
    }
  } catch (error) {
    return [{ msg: `${error.message}` }];
  }
};

const addBannerValidation = (req, res, next) => {
  const {
    position,
    closeButtonAction,
    fontColor,
    backgroundColor,
    url,
    actionUrl,
  } = req.body;
  const errors = [];

  const urlErrors = validateUrl(url);
  if (urlErrors) {
    errors.push(...urlErrors);
  }

  const relativeUrlErrors = validateRelativeUrl(actionUrl);
  if (relativeUrlErrors) {
    errors.push(...relativeUrlErrors);
  }

  if (!position || !closeButtonAction) {
    errors.push({ msg: "Position and closeButtonAction are required" });
  }

  const positionErrors = validatePositionWrapper(position);
  if (positionErrors) {
    errors.push(...positionErrors);
  }

  if (!validateCloseButtonAction(closeButtonAction)) {
    errors.push({ msg: "Invalid closeButtonAction value" });
  }

  const colorFields = { fontColor, backgroundColor };
  const colorErrors = checkColorFieldsFail(colorFields);
  if (colorErrors) {
    errors.push(...colorErrors);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

const deleteBannerValidation = (req, res, next) => {
  const { id } = req.params;
  const idErrors = validateId(id);

  if (idErrors) {
    return res.status(400).json({ errors: idErrors });
  }

  next();
};

const editBannerValidation = (req, res, next) => {
  const { id } = req.params;
  const { position, closeButtonAction, fontColor, backgroundColor } = req.body;
  const errors = [];

  const idErrors = validateId(id);
  if (idErrors) {
    errors.push(...idErrors);
  }

  if (!position || !closeButtonAction) {
    errors.push({ msg: "Position and closeButtonAction are required" });
  }

  const positionErrors = validatePositionWrapper(position);
  if (positionErrors) {
    errors.push(...positionErrors);
  }

  if (!validateCloseButtonAction(closeButtonAction)) {
    errors.push({ msg: "Invalid closeButtonAction value" });
  }

  const colorFields = { fontColor, backgroundColor };
  const colorErrors = checkColorFieldsFail(colorFields);
  if (colorErrors) {
    errors.push(...colorErrors);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

const getBannerByIdValidation = (req, res, next) => {
  const { id } = req.params;
  const idErrors = validateId(id);

  if (idErrors) {
    return res.status(400).json({ errors: idErrors });
  }

  next();
};

class ErrorHandler {
  static async handleAsync(res, operation, errorType) {
    try {
      const result = await operation();
      return result;
    } catch (err) {
      console.error(`${errorType}: `, err);
      const { statusCode, payload } = internalServerError(
        errorType,
        err.message
      );
      res.status(statusCode).json(payload);
      return null;
    }
  }
}

module.exports = {
  ErrorHandler,
  validatePosition,
  validatePositionWrapper,
  addBannerValidation,
  deleteBannerValidation,
  editBannerValidation,
  getBannerByIdValidation,
  validateUrl,
  validateRelativeUrl,
};
