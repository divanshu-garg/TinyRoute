import { deleteUrlFromUserDb, getAllUserUrlsFromDb } from "../dao/user.dao.js";
import { asyncHandler } from "../utils/tryCatchWrapper.js";

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