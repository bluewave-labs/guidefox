const popupService = require("../service/popup.service");
const { internalServerError } = require("../utils/errors.helper");
const { validateCloseButtonAction, validateRepetitionOption } = require("../utils/guide.helper");
const {
  validatePopupSize,
  validateUrl,
  validateRelativeUrl,
} = require("../utils/popup.helper");
const { checkColorFieldsFail } = require("../utils/guide.helper");

class PopupController {
  async addPopup(req, res) {
    const userId = req.user.id;
    const {
      popupSize,
      closeButtonAction,
      repetitionType,
      headerBackgroundColor,
      headerColor,
      textColor,
      buttonBackgroundColor,
      buttonTextColor,
      actionUrl,
      url,
    } = req.body;

    if (!popupSize || !closeButtonAction) {
      return res.status(400).json({
        errors: [{ msg: "popupSize and closeButtonAction are required" }],
      });
    }

    if (
      !validatePopupSize(popupSize) ||
      !validateCloseButtonAction(closeButtonAction) ||
      !validateRepetitionOption(repetitionType)
    ) {
      return res.status(400).json({
        errors: [{ msg: "Invalid value for popupSize or closeButtonAction or repetitionType" }],
      });
    }

    if (actionUrl) {
      try {
        validateUrl(actionUrl, "actionUrl");
      } catch (err) {
        return res.status(400).json({ errors: [{ msg: err.message }] });
      }
    }
    
    if (url) {
      try {
        validateRelativeUrl(url, "url");
      } catch (err) {
        return res.status(400).json({ errors: [{ msg: err.message }] });
      }
    }


    const colorFields = {
      headerBackgroundColor,
      headerColor,
      textColor,
      buttonBackgroundColor,
      buttonTextColor,
    };
    const colorCheck = checkColorFieldsFail(colorFields, res);
    if (colorCheck) {
      return colorCheck;
    }

    try {
      const newPopupData = { ...req.body, createdBy: userId };
      const newPopup = await popupService.createPopup(newPopupData);
      res.status(201).json(newPopup);
    } catch (err) {
      console.log(err);
      const { statusCode, payload } = internalServerError(
        "CREATE_POPUP_ERROR",
        err.message
      );
      res.status(statusCode).json(payload);
    }
  }

  async deletePopup(req, res) {
    try {
      const { id } = req.params;

      if (Number.isNaN(Number(id)) || id.trim() === "") {
        return res.status(400).json({ errors: [{ msg: "Invalid id" }] });
      }

      const deletionResult = await popupService.deletePopup(id);

      if (!deletionResult) {
        return res.status(400).json({
          errors: [{ msg: "Popup with the specified id does not exist" }],
        });
      }

      res
        .status(200)
        .json({ message: `Popup with ID ${id} deleted successfully` });
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "DELETE_POPUP_ERROR",
        err.message
      );
      res.status(statusCode).json(payload);
    }
  }

  async editPopup(req, res) {
    try {
      const { id } = req.params;
      const {
        popupSize,
        closeButtonAction,
        repetitionType,
        headerBackgroundColor,
        headerColor,
        textColor,
        buttonBackgroundColor,
        buttonTextColor,
        actionUrl,
        url,
      } = req.body;

      if (!popupSize || !closeButtonAction) {
        return res.status(400).json({
          errors: [{ msg: "popupSize and closeButtonAction are required" }],
        });
      }

      if (!validatePopupSize(popupSize)) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid value for popupSize" }] });
      }

      if (!validateCloseButtonAction(closeButtonAction)) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid value for closeButtonAction" }] });
      }

      if (!validateRepetitionOption(repetitionType)) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid value for repetition" }] });
      }

      if (actionUrl) {
        try {
          validateUrl(actionUrl, "actionUrl");
        } catch (err) {
          return res.status(400).json({ errors: [{ msg: err.message }] });
        }
      }

      if (url) {
        try {
          validateRelativeUrl(url, "url");
        } catch (err) {
          return res.status(400).json({ errors: [{ msg: err.message }] });
        }
      }

      const colorFields = {
        headerBackgroundColor,
        headerColor,
        textColor,
        buttonBackgroundColor,
        buttonTextColor,
      };
      const colorCheck = checkColorFieldsFail(colorFields, res);
      if (colorCheck) {
        return colorCheck;
      }

      const updatedPopup = await popupService.updatePopup(id, req.body);
      res.status(200).json(updatedPopup);
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "EDIT_POPUP_ERROR",
        err.message
      );
      res.status(statusCode).json(payload);
    }
  }

  async getAllPopups(req, res) {
    try {
      const popups = await popupService.getAllPopups();
      res.status(200).json(popups);
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "GET_ALL_POPUPS_ERROR",
        err.message
      );
      res.status(statusCode).json(payload);
    }
  }

  async getPopups(req, res) {
    try {
      const userId = req.user.id;
      const popups = await popupService.getPopups(userId);
      res.status(200).json(popups);
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "GET_POPUPS_ERROR",
        err.message
      );
      res.status(statusCode).json(payload);
    }
  }

  async getPopupById(req, res) {
    try {
      const { id } = req.params;

      if (Number.isNaN(Number(id)) || id.trim() === "") {
        return res.status(400).json({ errors: [{ msg: "Invalid popup ID" }] });
      }

      const popup = await popupService.getPopupById(id);

      if (!popup) {
        return res.status(404).json({ errors: [{ msg: "Popup not found" }] });
      }

      res.status(200).json(popup);
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "GET_POPUP_BY_ID_ERROR",
        err.message
      );
      res.status(statusCode).json(payload);
    }
  }
  async getPopupByUrl(req, res) {
    try {
      const { url } = req.body;

      if (!url || typeof url !== "string") {
        return res
          .status(400)
          .json({ errors: [{ msg: "URL is missing or invalid" }] });
      }

      const popup = await popupService.getPopupByUrl(url);
      res.status(200).json({ popup });
    } catch (error) {
      const { payload, statusCode } = internalServerError(
        "GET_POPUP_BY_URL_ERROR",
        error.message
      );
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new PopupController();
