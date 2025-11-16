import shortUrl from "../models/shortUrl.model.js";
import { AppError, NotFoundError } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/tryCatchWrapper.js";
import QRCode from "qrcode"
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

export const generateQr = asyncHandler(async (req,res)=>{
    const {url_slug} = req.params;
    const url = await shortUrl.findOne({short_url:url_slug});
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

export const downloadQr = asyncHandler(async (req,res)=>{
    const {short_url} = req.params;
    if(!short_url){
        throw new AppError("Short URL is required", 400);
    }

    const url = await shortUrl.findOne({short_url:short_url});
    if(!url?.qr_code_link){
        throw new NotFoundError("QR code not found for the given URL");
    }

    const qr_url = url.qr_code_link;
        const downloadUrl = qr_url.replace(
      '/upload/', 
      `/upload/fl_attachment:qr-${short_url}/`
    );
    
    res.redirect(downloadUrl);
})