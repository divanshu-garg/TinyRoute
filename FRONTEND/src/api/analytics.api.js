import axiosInstance from "../utils/axiosInstance.js";

const getOverallAnalytics = async () =>{
    console.log("fetching overall analytics");
    const {data} = await axiosInstance.get(`/api/analytics` )
    return data;
}

const getUrlAnalytics = async (shortUrl) =>{
    console.log("fetching overall analytics");
    const {data} = await axiosInstance.get(`/api/analytics/${shortUrl}` )
    return data;
}

export {getOverallAnalytics, getUrlAnalytics}