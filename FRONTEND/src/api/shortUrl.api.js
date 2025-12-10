import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async (longUrl, maxClicks, expiresAt)=>{
    console.log("max:", maxClicks)
    const response = await axiosInstance.post("/api/create", { longUrl, maxClicks, expiresAt });
    return response.data;
}

export const createCustomShortUrl = async (longUrl, slug, maxClicks, expiresAt)=>{
    const response = await axiosInstance.post("/api/create", { longUrl, slug, maxClicks, expiresAt });
    return response.data;
}