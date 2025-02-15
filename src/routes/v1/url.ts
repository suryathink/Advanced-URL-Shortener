import express from "express";
import { createShortUrl,getUrlAnalytics } from "../../controllers/urlController";
import {isAuthenticated} from "../../middlewares/auth"
const router = express.Router();

router.post("/shorten", isAuthenticated, createShortUrl as any);
router.get("/analytics/:alias", getUrlAnalytics as any);

export default router;
