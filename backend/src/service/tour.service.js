const db = require('../models');
const { Op } = require('sequelize');

const Tour = db.Tour;
const TourPopup = db.TourPopup;

class TourService {
  async getAllTours() {
    return await Tour.findAll();
  }

  async getTourById(id) {
    const response = await Tour.findByPk(id, {
      include: [
        {
          model: TourPopup,
          as: "steps", 
        },
      ],
    });

    return response
  }

  async getTourByUserId(userId) {
    return await Tour.findAll({
      where: {
        createdBy: userId,
      },
        include: [
          {
            model: db.TourPopup,
            as: 'steps',
          },
        ],
    });
  }

  async getTourByUrl(url) {
    try {
      return await Tour.findAll({
        where: {
          [Op.and]: [{ url }, { active: true }],
        },
        include: [
          {
            model: db.TourPopup,
            as: 'steps',
          },
        ],
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error finding tour by url');
    }
  }

  async getIncompleteTourByUrl(url, ids) {
    try {
      return await Tour.findAll({
        where: {
          url,
          id: {
            [Op.notIn]: ids,
          },
        },
        include: [
          {
            model: db.TourPopup,
            as: 'steps',
          },
        ],
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error finding incomplete tours by url');
    }
  }

  async createTour(data) {
    const { steps, ...info } = data;
    const transaction = await db.sequelize.transaction();
    try {
      const newTour = await Tour.create(info, {
        transaction,
        returning: true,
      });

      const formattedSteps = steps.map((step) => ({
        ...step,
        tourId: newTour.id,
      }));

      await TourPopup.bulkCreate(formattedSteps, { transaction });

      await transaction.commit();
      return newTour;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateTour(id, data) {
    const { steps, ...info } = data;
    const transaction = await db.sequelize.transaction();
    try {
      const [affectedRows, [updatedTour]] = await Tour.update(info, {
        where: { id },
        transaction,
        returning: true,
      });
      if (affectedRows === 0) {
        await transaction.commit();
        return null;
      }
      await TourPopup.destroy({ where: { tourId: id }, transaction });
      const formattedSteps = steps.map((step) => ({
        ...step,
        tourId: id,
      }));
      await TourPopup.bulkCreate(formattedSteps, { transaction });
      await transaction.commit();
      return updatedTour;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteTour(id) {
    const transaction = await db.sequelize.transaction();
    try {
      await TourPopup.destroy({ where: { tourId: id }, transaction });
      const rowsAffected = await Tour.destroy({
        where: { id },
        transaction,
      });
      await transaction.commit();
      return rowsAffected !== 0;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new TourService();
