import axiosInstance from "../utils/axiosInstance.js";

const generateQr = async (url_slug ) =>{
    console.log("reached here", url_slug)
    const {data} = await axiosInstance.post(`/api/qr/generate/${url_slug}` )
    return data;
}

export {generateQr}