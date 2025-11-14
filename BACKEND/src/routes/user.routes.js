import e from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllUserUrls } from "../controllers/user.controller.js";

const router = e.Router();

router.post("/urls",authMiddleware, getAllUserUrls)

export default router;