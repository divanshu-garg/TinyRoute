import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { byIso } from "country-code-lookup";

export const generateNanoId = (length) => nanoid(length);

export const signToken = (payload) => {
    // get only userid in payload
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
    // returns userid payload on success
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const getDeviceType = (type)=>{
  if(type === "mobile") return "mobile"
  if(type === "tablet") return "tablet"
  // for desktop, us parser returns null, undefined or ""
  if(!type) return "desktop"

  return "unknown"
}

export const getCountryFromCode = (countryCode) => {
  if(!countryCode) return "unknown"
  const result =  byIso(countryCode);
  return result?.country || "unknown";
}