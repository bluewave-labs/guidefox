const HintService = require('../service/hint.service');
const { internalServerError } = require('../utils/errors.helper');

class HintController {
  async addHint(req, res) {
    const userId = req.user.id;

    try {
      const hint = await HintService.createHint({
        ...req.body,
        createdBy: userId,
      });

      return res.status(201).json(hint);
    } catch (error) {
      console.error(`CREATE_HINT_ERROR: ${error.message}`);
      const { statusCode, payload } = internalServerError(
        'CREATE_HINT_ERROR',
        'An unexpected error occurred while creating the hint'
      );
      res.status(statusCode).json(payload);
    }
  }

  async getHints(req, res) {
    const userId = req.user.id;

    try {
      const hints = await HintService.getHints(userId);
      return res.status(200).json(hints);
    } catch (error) {
      console.error(`GET_HINTS_ERROR: ${error.message}`);
      const { statusCode, payload } = internalServerError(
        'GET_HINTS_ERROR',
        'An unexpected error occurred while retrieving hints'
      );
      res.status(statusCode).json(payload);
    }
  }

  async getAllHints(req, res) {
    try {
      const hints = await HintService.getAllHints();
      return res.status(200).json(hints);
    } catch (error) {
      console.error(`GET_ALL_HINTS_ERROR: ${error.message}`);
      const { statusCode, payload } = internalServerError(
        'GET_ALL_HINTS_ERROR',
        'An unexpected error occurred while retrieving hints'
      );
      res.status(statusCode).json(payload);
    }
  }

  async getHintById(req, res) {
    const { hintId } = req.params;

    try {
      const hint = await HintService.getHintById(hintId);

      if (!hint) {
        return res.status(404).json({
          errors: [{ msg: 'Hint not found' }],
        });
      }

      return res.status(200).json(hint);
    } catch (error) {
      console.error(`GET_HINT_BY_ID_ERROR: ${error.message}`);
      const { statusCode, payload } = internalServerError(
        'GET_HINT_BY_ID_ERROR',
        'An unexpected error occurred while retrieving the hint'
      );
      res.status(statusCode).json(payload);
    }
  }

  async updateHint(req, res) {
    const { hintId } = req.params;

    try {
      const hint = await HintService.getHintById(hintId);

      if (!hint) {
        return res.status(404).json({
          errors: [{ msg: 'Hint not found' }],
        });
      }

      const updatedHint = await HintService.updateHint(hintId, req.body);

      return res.status(200).json(updatedHint);
    } catch (error) {
      console.error(`UPDATE_HINT_ERROR: ${error.message}`);
      const { statusCode, payload } = internalServerError(
        'UPDATE_HINT_ERROR',
        'An unexpected error occurred while updating the hint'
      );
      res.status(statusCode).json(payload);
    }
  }

  async deleteHint(req, res) {
    const { hintId } = req.params;

    try {
      const deleted = await HintService.deleteHint(hintId);

      if (!deleted) {
        return res.status(404).json({
          errors: [{ msg: 'Hint not found' }],
        });
      }

      return res.status(200).json({
        message: `Hint with ID ${hintId} deleted successfully`,
      });
    } catch (error) {
      console.error(`DELETE_HINT_ERROR: ${error.message}`);
      const { statusCode, payload } = internalServerError(
        'DELETE_HINT_ERROR',
        'An unexpected error occurred while deleting the hint'
      );
      res.status(statusCode).json(payload);
    }
  }

  async getHintByUrl(req, res) {
    try {
      const { url } = req.body;

      const hint = await HintService.getHintByUrl(url);
      res.status(200).json({ hint });
    } catch (error) {
      const {payload, statusCode} =internalServerError('GET_HINT_BY_URL_ERROR', error.message);
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new HintController();
