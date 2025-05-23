const popupService = require("../service/popup.service");
const { internalServerError } = require("../utils/errors.helper");

class PopupController {
  async addPopup(req, res) {
    const userId = req.user.id;

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
