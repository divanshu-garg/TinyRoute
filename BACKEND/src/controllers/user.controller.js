import { getAllUserUrlsFromDb } from "../dao/user.dao.js";
import { asyncHandler } from "../utils/tryCatchWrapper.js";

export const getAllUserUrls = asyncHandler(async (req,res)=>{
    const {_id} = req.user;
    const urls = await getAllUserUrlsFromDb(_id);
    if(urls) res.status(200).json({urls});
})