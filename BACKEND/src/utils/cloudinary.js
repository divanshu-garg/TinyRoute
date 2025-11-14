import { v2 as cloudinary } from 'cloudinary'
import { config as configDotenv } from "dotenv";
configDotenv();

cloudinary.config({
  cloud_name: 'divanshugarg',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (encodedUrl)=>{
    // console.log(process.env.CLOUDINARY_API_KEY, "api key")
    // console.log(process.env.CLOUDINARY_API_SECRET, "api_secret");
    return await cloudinary.uploader.upload(encodedUrl, {
        folder: 'qr-codes',
        resource_type:'image'
    })
}

export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};