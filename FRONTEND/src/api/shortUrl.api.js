import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async (longUrl)=>{
    const response = await axiosInstance.post("/api/create", { longUrl });
    return response.data;
}

export const createCustomShortUrl = async (longUrl, slug)=>{
    const response = await axiosInstance.post("/api/create", { longUrl, slug });
    return response.data;
}