import urlSchema from "../models/shorturl.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, maxClicks, expiresAt, userid) => {
  try {
    const newUrl = new urlSchema({
      full_url: longUrl,
      short_url: shortUrl,
      isActive: true,
    });
    if (userid) newUrl.user = userid;
    if (maxClicks && parseInt(maxClicks) > 0) {
      newUrl.maxClicks = parseInt(maxClicks);
    }
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (expiryDate > new Date()) {
        newUrl.expiresAt = expiryDate;
      }
    }
    await newUrl.save();
  } catch (error) {
    throw new ConflictError("Short URL already exists");
  }
};

export const getShortUrl = async (id) => {
  return await urlSchema.findOneAndUpdate({ short_url: id }, { $inc: { clicks: 1 } });
};

export const checkSlugExists = async(slug) =>{
  const urlExists = await urlSchema.findOne({short_url:slug});
  return urlExists ? true : false;

}