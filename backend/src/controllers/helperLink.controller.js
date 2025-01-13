const helperService = require('../service/helperLink.service');
const { internalServerError } = require('../utils/errors.helper');

class LinkController {
  async addHelper(req, res) {
    const userId = req.user.id;
    const { links } = req.body;

    try {
      const newHelperData = {
        ...req.body,
        createdBy: userId,
      };
      const newHelper = await helperService.createHelper(newHelperData, links);
      res.status(201).json(newHelper);
    } catch (err) {
      console.log(err);
      const { statusCode, payload } = internalServerError('CREATE_HELPER_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async deleteHelper(req, res) {
    try {
      const { id } = req.params;

      const deletionResult = await helperService.deleteHelper(id);

      if (!deletionResult) {
        return res.status(404).json({
          errors: [{ msg: 'Helper with the specified id does not exist' }],
        });
      }

      res.status(200).json({ message: `Helper with ID ${id} deleted successfully` });
    } catch (err) {
      const { statusCode, payload } = internalServerError('DELETE_HELPER_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async editHelper(req, res) {
    try {
      const { id } = req.params;
      const { links } = req.body;

      const updatedHelper = await helperService.updateHelper(id, req.body, links);

      if (!updatedHelper) {
        return res.status(404).json({
          errors: [{ msg: 'Helper with the specified id does not exist' }],
        });
      }

      res.status(200).json(updatedHelper);
    } catch (err) {
      const { statusCode, payload } = internalServerError('EDIT_HELPER_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getAllHelpers(_, res) {
    try {
      const links = await helperService.getAllHelpers();
      res.status(200).json(links);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_ALL_HELPERS_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getAllHelpersWithLinks(_, res) {
    try {
      const links = await helperService.getAllHelpersWithLinks();
      res.status(200).json(links);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_ALL_HELPERS_WITH_LINKS_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getHelpersByUserId(req, res) {
    try {
      const userId = req.user.id;
      const helpers = await helperService.getHelpersByUserId(userId);
      res.status(200).json(helpers);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_HELPERS_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getHelperById(req, res) {
    try {
      const { id } = req.params;

      const helper = await helperService.getHelperById(id);

      if (!helper) {
        return res.status(404).json({ errors: [{ msg: 'Helper not found' }] });
      }

      res.status(200).json(helper);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_HELPER_BY_ID_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = {
  controller: new LinkController()
};
