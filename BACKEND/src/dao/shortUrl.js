import urlSchema from "../models/shortUrl.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, userid) => {
  try {
    const newUrl = new urlSchema({
      full_url: longUrl,
      short_url: shortUrl,
    });
    if (userid) newUrl.user = userid;
    await newUrl.save();
  } catch (error) {
    throw new ConflictError("Short URL already exists");
  }
};

export const getShortUrl = async (id) => {
  return await urlSchema.findOne({ short_url: id }, { $inc: { clicks: 1 } });
};
