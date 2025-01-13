const { Op } = require("sequelize");
const db = require("../models");
const Popup = db.Popup;

class PopupService {
  async getAllPopups() {
    return await Popup.findAll();
  }

  async getPopups(userId) {
    return await Popup.findAll({
      where: {
        createdBy: userId
      },
    });
  }

  async createPopup(data) {
    return await Popup.create(data);
  }

  async deletePopup(id) {
    const rowsAffected = await Popup.destroy({ where: { id } });

    if (rowsAffected === 0) {
      return false;
    }

    return true;
  }

  async updatePopup(id, data) {
    const [affectedRows, updatedPopups] = await Popup.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedRows === 0) {
      return null;
    }

    return updatedPopups[0];
  }

  async getPopupById(popupId) {
    try {
      return await Popup.findOne({
        where: { id: popupId },
      });
    } catch (error) {
      throw new Error("Error retrieving popup by ID");
    }
  }

  async getPopupByUrl(url) {
    try {
      return await Popup.findAll({ where: { url } });
    } catch (error) {
      throw new Error("Error retrieving Popup by URL");
    }
  };
  
  async getPopupByApiAndClientId(apiId, clientId) {
    try {
      return await Popup.findAll({
        include: [
          {
            model: db.User,
            as: "creator",
            where: { apiId }
          },
        ],
        where: { clientId },
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw new Error("Error retrieving popups for the given API and Client ID");
    }
  }

  async getIncompletePopupsByUrl(url, ids) {
    try {
      return await Popup.findAll({
        where: {
          url,
          id: { [Op.notIn]: ids }
        }
      });
    } catch (error) {
      throw new Error("Error retrieving popup by URL");
    }
  };
}

module.exports = new PopupService();
