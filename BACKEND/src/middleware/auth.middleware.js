import { findUserById } from "../dao/user.dao.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { verifyToken } from "../utils/helper.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.token;
  if (!token) throw UnauthorizedError("user not logged in");

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ message: "user not logged in" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "user not logged in" });
  }
};

export const attachUserMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next();
  try {
    const decoded = verifyToken(token);
    if (!decoded) return next();
    const user = await findUserById(decoded.id);
    if(!user) return next()
    req.user = user;
    return next();
  } catch (error) {
    console.error("attachUserMiddleware error:", error.message);
    next();
  }
};
