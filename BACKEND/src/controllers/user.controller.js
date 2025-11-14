import { deleteUrlFromUserDb, getAllUserUrlsFromDb } from "../dao/user.dao.js";
import QRCode from "qrcode"
import { asyncHandler } from "../utils/tryCatchWrapper.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import shortUrl from "../models/shortUrl.model.js";

export const getAllUserUrls = asyncHandler(async (req,res)=>{
    const {_id} = req.user;
    const urls = await getAllUserUrlsFromDb(_id);
    if(urls) res.status(200).json({urls});
})

export const deleteUrlFromUser = asyncHandler(async (req,res)=>{
    const {url_id} = req.params;
    const {user_id} = req.body;
    console.log("getting here", url_id, user_id);
    
    const deleted = await deleteUrlFromUserDb(url_id, user_id);
    if(deleted) res.status(200).json({message:"url deleted successfully"})
})

export const generateQr = asyncHandler(async (req,res)=>{
    const {url_id} = req.params;
    const url = await shortUrl.findById(url_id);
    if(!url){
        throw new NotFoundError("URL not found");
    }
    if(url.qr_code_link){
        return res.status(200).json({message:"QR code already exists", qr_code_link: url.qr_code_link});
    }
    const encodedQr = await QRCode.toDataURL(process.env.APP_URL + url.short_url)
     if(!encodedQr){
        return res.status(500).json({message:"failed to generate qr code"});
    }
    const clodinaryUrl = await uploadToCloudinary(encodedQr);
    console.log("cloudinary url:", clodinaryUrl.secure_url)
     if(!clodinaryUrl || !clodinaryUrl.secure_url){
      throw new AppError("Failed to upload QR code to Cloudinary", 500);
    }
    url.qr_code_link = clodinaryUrl.secure_url;
    const saved = await url.save();
    if(!saved){
        await deleteFromCloudinary(clodinaryUrl.public_id);
        throw new AppError("Failed to save QR code link to database", 500);
    }
    res.status(200).json({message:"QR code generated successfully", qr_code_link: url.qr_code_link});
})