import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export const generateNanoId = (length) => nanoid(length);

export const signToken = (payload) => {
    // get only userid in payload
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
    // returns userid payload on success
  return jwt.verify(token, process.env.JWT_SECRET);
};
