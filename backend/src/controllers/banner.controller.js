const bannerService = require("../service/banner.service.js");
const db = require("../models/index.js");
const { ErrorHandler } = require("../utils/banner.helper.js");
const Banner = db.Banner;

class BannerController {
  async addBanner(req, res) {
    return await ErrorHandler.handleAsync(
      res,
      async () => {
        const newBannerData = {
          ...req.body,
          createdBy: req.user.id,
        };
        const newBanner = await bannerService.createBanner(newBannerData);
        return res.status(201).json({
          success: true,
          data: newBanner,
        });
      },
      "CREATE_BANNER_ERROR"
    );
  }

  async deleteBanner(req, res) {
    return await ErrorHandler.handleAsync(
      res,
      async () => {
        const { id } = req.params;
        const deletionResult = await bannerService.deleteBanner(id);

        if (!deletionResult) {
          return res.status(404).json({
            success: false,
            error: "Banner not found",
          });
        }

        return res.status(200).json({
          success: true,
          message: `Banner with ID ${id} deleted successfully`,
        });
      },
      "DELETE_BANNER_ERROR"
    );
  }

  async editBanner(req, res) {
    return await ErrorHandler.handleAsync(
      res,
      async () => {
        const { id } = req.params;
        const updatedBanner = await bannerService.updateBanner(id, req.body);

        if (!updatedBanner) {
          return res.status(404).json({
            success: false,
            error: "Banner not found",
          });
        }

        return res.status(200).json({
          success: true,
          data: updatedBanner,
        });
      },
      "EDIT_BANNER_ERROR"
    );
  }

  async getAllBanners(req, res) {
    return await ErrorHandler.handleAsync(
      res,
      async () => {
        const banners = await bannerService.getAllBanners();
        return res.status(200).json({
          success: true,
          data: banners,
        });
      },
      "GET_ALL_BANNERS_ERROR"
    );
  }

  async getBanners(req, res) {
    return await ErrorHandler.handleAsync(
      res,
      async () => {
        const userId = req.user.id;
        const banners = await bannerService.getBanners(userId);
        return res.status(200).json({
          success: true,
          data: banners,
        });
      },
      "GET_BANNERS_ERROR"
    );
  }

  async getBannerById(req, res) {
    return await ErrorHandler.handleAsync(
      res,
      async () => {
        const { id } = req.params;
        const banner = await bannerService.getBannerById(id);

        if (!banner) {
          return res.status(404).json({
            success: false,
            error: "Banner not found",
          });
        }

        return res.status(200).json({
          success: true,
          data: banner,
        });
      },
      "GET_BANNER_BY_ID_ERROR"
    );
  }
  async getBannerByUrl(req, res) {
    try {
      const { url } = req.body;

      if (!url || typeof url !== "string") {
        return res
          .status(400)
          .json({ errors: [{ msg: "URL is missing or invalid" }] });
      }

      const banner = await bannerService.getBannerByUrl(url);
      res.status(200).json({ banner });
    } catch (error) {
      const { payload, statusCode } = internalServerError(
        "GET_BANNER_BY_URL_ERROR",
        error.message
      );
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new BannerController();
