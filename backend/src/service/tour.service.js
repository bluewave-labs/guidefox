const db = require("../models");
const Tour = db.Tour;

class TourService {
  async getAllTours() {
    return await Tour.findAll();
  }

  async getTours(userId) {
    return await Tour.findAll({
      where: {
        createdBy: userId
      },
    });
  }

  async createTour(data) {
    return await Tour.create(data);
  }

  async deleteTour(id) {
    const rowsAffected = await Tour.destroy({ where: { id } });

    if (rowsAffected === 0) {
      return false;
    }

    return true;
  }

  async updateTour(id, data) {
    const [affectedRows, updatedTours] = await Tour.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedRows === 0) {
      return null;
    }

    return updatedTours[0];
  }

  async getTourById(tourId) {
    try {
      return await Tour.findOne({
        where: { id: tourId },
      });
    } catch (error) {
      throw new Error("Error retrieving tour by ID");
    }
  }

  async getTourByUrl(url) {
    try {
      return await Tour.findAll({ where: { url } });
    } catch (error) {
      throw new Error("Error retrieving Tour by URL");
    }
  };
}

module.exports = new TourService();
