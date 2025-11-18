import e from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAnalyticsData } from "../controllers/analytics.controller.js";

const router = e.Router();

router.get("/", authMiddleware, getAnalyticsData);

export default router;