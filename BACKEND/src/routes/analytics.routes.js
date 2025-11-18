import e from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getAnalyticsDataByUrl } from "../controllers/analytics.controller.js";

const router = e.Router();

router.get("/", authMiddleware, getAnalyticsData);
router.get("/:url_id", authMiddleware, getAnalyticsDataByUrl);

export default router;