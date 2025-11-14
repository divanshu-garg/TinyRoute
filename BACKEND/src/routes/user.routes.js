import e from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteUrlFromUser, getAllUserUrls } from "../controllers/user.controller.js";

const router = e.Router();

router.get("/urls",authMiddleware, getAllUserUrls)
router.delete("/urls/:url_id",authMiddleware, deleteUrlFromUser)
export default router;