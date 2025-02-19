import express from "express";
import {
  createShortUrl,
  getUrlAnalytics,
  redirectUrl,
  getTopicBasedAnalytics,
  getOverallAnalytics,
} from "../../controllers/urlController";
import { isAuthenticated } from "../../middlewares/auth";
import { shortUrlLimiterMiddleware } from "../../middlewares/authLimiter";
import {
  validateAliasParam,
  validateShortUrlBody,
} from "../../middlewares/urlShortenerMiddlewares";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: URL Shortener
 *   description: API for shortening URLs and retrieving analytics
 */

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags: [URL Shortener]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: "https://example.com"
 *               alias:
 *                 type: string
 *                 example: "mycustomalias"
 *     responses:
 *       201:
 *         description: Successfully created short URL
 */
router.post(
  "/shorten",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  validateShortUrlBody as any,
  createShortUrl as any
);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL alias
 *     responses:
 *       302:
 *         description: Redirects to original URL
 */
router.get("/shorten/:alias", validateAliasParam as any, redirectUrl as any);

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics data
 */
router.get(
  "/analytics/overall",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  getOverallAnalytics as any
);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic name
 *     responses:
 *       200:
 *         description: Topic-based analytics data
 */
router.get(
  "/analytics/topic/:topic",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  getTopicBasedAnalytics as any
);

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a short URL
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL alias
 *     responses:
 *       200:
 *         description: Short URL analytics data
 */
router.get(
  "/analytics/:alias",
  isAuthenticated,
  shortUrlLimiterMiddleware,
  validateAliasParam as any,
  getUrlAnalytics as any
);

export default router;
