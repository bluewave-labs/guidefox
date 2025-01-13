const linkService = require('../service/link.service');
const { internalServerError } = require('../utils/errors.helper');

class LinkController {
  async addLink(req, res) {
    const { title, url, order, helperId, target } = req.body;

    try {
      const allLinks = await linkService.getLinksByHelperId(helperId);
      if (order && order > allLinks.length + 1) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid value for order' }],
        });
      }

      const newLinkData = {
        title,
        url,
        order: order || allLinks.length + 1,
        helperId,
        target: target ?? true,
      };
      const newPopup = await linkService.createLink(newLinkData);
      res.status(201).json(newPopup);
    } catch (err) {
      console.log(err);
      const { statusCode, payload } = internalServerError('CREATE_LINK_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async deleteLink(req, res) {
    try {
      const { id } = req.params;

      const deletionResult = await linkService.deleteLink(id);

      if (!deletionResult) {
        return res.status(404).json({
          errors: [{ msg: 'Link with the specified id does not exist' }],
        });
      }

      res.status(200).json({ message: `Link with ID ${id} deleted successfully` });
    } catch (err) {
      const { statusCode, payload } = internalServerError('DELETE_LINK_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async editLink(req, res) {
    try {
      const { id } = req.params;
      const { title, url, order, helperId, target } = req.body;

      const allLinks = await linkService.getLinksByHelperId(helperId);
      if (order && order > allLinks.length + 1) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid value for order' }],
        });
      }

      const newLinkData = {
        title,
        url,
        order: order || allLinks.length + 1,
        helperId,
        target: target ?? true,
      };

      const updatedLink = await linkService.updateLink(id, newLinkData);
      res.status(200).json(updatedLink);
    } catch (err) {
      const { statusCode, payload } = internalServerError('EDIT_LINK_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getAllLinks(_, res) {
    try {
      const links = await linkService.getAllLinks();
      res.status(200).json(links);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_ALL_LINKS_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getLinksByHelperId(req, res) {
    try {
      const { helperId } = req.query;
      const links = await linkService.getLinksByHelperId(helperId);
      res.status(200).json(links);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_LINKS_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getLinksById(req, res) {
    try {
      const { id } = req.params;

      const link = await linkService.getLinkById(id);

      if (!link) {
        return res.status(404).json({ errors: [{ msg: 'Link not found' }] });
      }

      res.status(200).json(link);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_LINK_BY_ID_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getLinkByUrl(req, res) {
    try {
      const { url } = req.body;

      const link = await linkService.getLinkByUrl(url);
      res.status(200).json({ link });
    } catch (error) {
      const { statusCode, payload } = internalServerError('GET_LINK_BY_URL_ERROR', error.message);
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new LinkController();
