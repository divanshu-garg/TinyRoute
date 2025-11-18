import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import Click from "../models/clicks.model.js";
import { getCountryFromCode, getDeviceType, handleBrowserName } from "./helper.js";

//TODO: HASH IP ADDRESS BEFORE STORING
export const saveClickData = async (req, shortUrl) => {
  // const user = req.user;

  const userAgent = req.headers["user-agent"];
  const parsedUserAgent = UAParser(userAgent);
  const deviceType = getDeviceType(parsedUserAgent.device.type);
  const browser = handleBrowserName(parsedUserAgent.browser.name) || "unknown";

  // USER will come from my vercel or ONRENDER, which is a proxy. proxy attaches actual user ip on x-forwarded-for type headers
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  // const ip = "8.8.8.8";
  const parsedIp = geoip.lookup(ip);
  const referer = req.headers.referer;
  const country = getCountryFromCode(parsedIp?.country);

  const click = new Click();
  // console.log("url id:", shortUrl._id)
  click.short_url_id = shortUrl._id;
  click.browser = browser || "unknown";
  click.device_type = deviceType || "unknown";
  click.country_code = parsedIp?.country || "unknown";
  click.city = parsedIp?.city || "unknown";
  click.region = parsedIp?.region || "unknown";
  click.country = country;
  click.referrer = referer || "direct";
  click.ip_address = ip || "unknown";
  click.user = shortUrl.user || null;
  await click.save();
};
