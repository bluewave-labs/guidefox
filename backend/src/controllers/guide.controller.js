const bannerService = require("../service/banner.service");
const guidelogService = require("../service/guidelog.service");
const helperLinkService = require("../service/helperLink.service");
const popupService = require("../service/popup.service");
const hintService = require("../service/hint.service");
const { internalServerError } = require("../utils/errors.helper");

class GuideController {
    async getGuidesByUrl(req, res) {
        try {
            const { url } = req.body;

            if (!url || typeof url !== 'string') {
                return res.status(400).json({ errors: [{ msg: "URL is missing or invalid" }] });
            }
            const [banner, popup, hint, helperLink] = await Promise.all([
                bannerService.getBannerByUrl(url),
                popupService.getPopupByUrl(url),
                hintService.getHintByUrl(url),
                helperLinkService.getAllHelpersWithLinks(),
            ]);
            res.status(200).json({ banner, popup, hint, helperLink });
        } catch (error) {
            internalServerError(
                "GET_GUIDES_BY_URL_ERROR",
                error.message,
            );
        }
    }

    async getIncompleteGuidesByUrl(req, res) {
        try {
            const { url, userId } = req.body;

            if (!url || typeof url !== 'string') {
                return res.status(400).json({ errors: [{ msg: "URL is missing or invalid" }] });
            }
            if (!userId || typeof userId !== 'string') {
                return res.status(400).json({ errors: [{ msg: "userId is missing or invalid" }] });
            }

            const [completePopupLogs, completeBannerLogs, completeHintLogs, completeHelperLogs] = await Promise.all([
                guidelogService.getCompletePopupLogs(userId),
                guidelogService.getCompleteBannerLogs(userId),
                guidelogService.getCompleteHintLogs(userId),
                guidelogService.getCompleteHelperLogs(userId),
            ]);

            const popupIds = completePopupLogs.map(log => log.guideId);
            const bannerIds = completeBannerLogs.map(log => log.guideId);
            const hintIds = completeHintLogs.map(log => log.guideId);
            const helperLinkIds = completeHelperLogs.map(log => log.guideId);

            const [popup, banner, hint, helperLink] = await Promise.all([
                popupService.getIncompletePopupsByUrl(url, popupIds),
                bannerService.getIncompleteBannersByUrl(url, bannerIds),
                hintService.getIncompleteHintsByUrl(url, hintIds),
                helperLinkService.getAllHelpersWithLinks(),
            ]);
            res.status(200).json({popup, banner, hint, helperLink });

        } catch (error) {
            internalServerError(
                "GET_INCOMPLETE_GUIDES_BY_URL_ERROR",
                error.message,
            );
        }
    }
}

module.exports = new GuideController();
