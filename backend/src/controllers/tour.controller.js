const TourService = require('../service/tour.service');
const { internalServerError } = require('../utils/errors.helper');

class TourController {
  async getAllTours(req, res) {
    try {
      const tours = await TourService.getAllTours();
      res.status(200).json(tours);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_TOUR_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getTourById(req, res) {
    try {
      const { id } = req.params;

      const tour = await TourService.getTourById(id);

      if (!tour) {
        return res.status(404).json({
          errors: [{ msg: 'Tour with the specified id does not exist' }],
        });
      }

      res.status(200).json(tour);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_TOUR_BY_ID_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getToursByUserId(req, res) {
    try {
      const userId = req.user.id;
      const tours = await TourService.getTourByUserId(userId);
      res.status(200).json(tours);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_TOUR_BY_USER_ID_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async createTour(req, res) {
    try {
      const userId = req.user.id;
      const tour = await TourService.createTour({ ...req.body, createdBy: userId });
      res.status(201).json(tour);
    } catch (err) {
      const { statusCode, payload } = internalServerError('CREATE_TOUR_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async updateTour(req, res) {
    try {
      const { id } = req.params;
      const { userId, ...data } = req.body;
      const tour = await TourService.updateTour(id, data);

      if (!tour) {
        return res.status(404).json({
          errors: [{ msg: 'Tour with the specified id does not exist' }],
        });
      }

      res.status(200).json(tour);
    } catch (err) {
      const { statusCode, payload } = internalServerError('UPDATE_TOUR_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async deleteTour(req, res) {
    try {
      const { id } = req.params;
      const tour = await TourService.deleteTour(id);

      if (!tour) {
        return res.status(404).json({
          errors: [{ msg: 'Tour with the specified id does not exist' }],
        });
      }

      res.status(200).json({ message: 'Tour deleted successfully' });
    } catch (err) {
      const { statusCode, payload } = internalServerError('DELETE_TOUR_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new TourController();
