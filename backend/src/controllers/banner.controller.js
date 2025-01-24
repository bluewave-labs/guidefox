const bannerService = require('../service/banner.service.js');
const { internalServerError } = require('../utils/errors.helper');

class BannerController {
  async addBanner(req, res) {
    const userId = req.user.id;

    try {
      const newBannerData = { ...req.body, createdBy: userId };
      const newBanner = await bannerService.createBanner(newBannerData);
      res.status(201).json(newBanner);
    } catch (err) {
      const { statusCode, payload } = internalServerError('CREATE_BANNER_ERROR', err.message);
      console.log('here is the error yar', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async deleteBanner(req, res) {
    try {
      const { id } = req.params;
      const deletionResult = await bannerService.deleteBanner(id);

      if (!deletionResult) {
        return res.status(400).json({
          errors: [{ msg: 'Banner with the specified id does not exist' }],
        });
      }
      res.status(200).json({ message: `Banner with ID ${id} deleted successfully` });
    } catch (err) {
      const { statusCode, payload } = internalServerError('DELETE_BANNER_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async editBanner(req, res) {
    try {
      const { id } = req.params;
      const updatedBanner = await bannerService.updateBanner(id, req.body);
      res.status(200).json(updatedBanner);
    } catch (err) {
      const { statusCode, payload } = internalServerError('EDIT_BANNER_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getAllBanners(req, res) {
    try {
      const banners = await bannerService.getAllBanners();
      res.status(200).json(banners);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_ALL_BANNERS_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getBanners(req, res) {
    try {
      const userId = req.user.id;
      const banners = await bannerService.getBanners(userId);
      res.status(200).json(banners);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_BANNERS_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }

  async getBannerById(req, res) {
    try {
      const { id } = req.params;
      const banner = await bannerService.getBannerById(id);

      if (!banner) {
        return res.status(404).json({ errors: [{ msg: 'Banner not found' }] });
      }

      res.status(200).json(banner);
    } catch (err) {
      const { statusCode, payload } = internalServerError('GET_BANNER_BY_ID_ERROR', err.message);
      res.status(statusCode).json(payload);
    }
  }
  async getBannerByUrl(req, res) {
    try {
      const { url } = req.body;
      const banner = await bannerService.getBannerByUrl(url);
      res.status(200).json({ banner });
    } catch (error) {
      const { payload, statusCode } = internalServerError('GET_BANNER_BY_URL_ERROR', error.message);
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new BannerController();
