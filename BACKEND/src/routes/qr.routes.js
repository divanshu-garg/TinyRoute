import e from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { generateQr, downloadQr } from "../controllers/qr.controller.js";

const router = e.Router();
console.log("reached route");
router.post("/generate/:url_slug", authMiddleware, generateQr)
router.get("/download/:short_url", authMiddleware, downloadQr)
export default router;