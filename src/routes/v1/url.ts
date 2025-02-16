import express, { Request } from "express";
import {
  createShortUrl,
  getUrlAnalytics,
  redirectUrl,
  getTopicBasedAnalytics,
  getOverallAnalytics,
} from "../../controllers/urlController";
import { isAuthenticated } from "../../middlewares/auth";
import { shortUrlLimiterMiddleware } from "../../middlewares/authLimiter";
import { validateShortUrlBody } from "../../middlewares/urlShortenerMiddlewares";
const router = express.Router();

// url creation route
router.post(
  "/shorten",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  validateShortUrlBody as any,
  createShortUrl as any
);

router.get("/shorten/:alias", redirectUrl as any);

router.get(
  "/analytics/overall",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  getOverallAnalytics as any
);
router.get(
  "/analytics/topic/:topic",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  getTopicBasedAnalytics as any
);
router.get(
  "/analytics/:alias",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  getUrlAnalytics as any
);

export default router;
