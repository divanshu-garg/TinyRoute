import { generateNanoId } from "../utils/helper.js";
import { checkSlugExists, saveShortUrl } from "../dao/shortUrl.js";
import { getShortUrl } from "../dao/shortUrl.js";
import {asyncHandler} from "../utils/tryCatchWrapper.js";

const createShortUrl = asyncHandler( async (req, res) => {
    const { longUrl, slug } = req.body;
    console.log(longUrl);
    if(!longUrl){
        return res.status(400).json({message:"url is required"})
    }
    let shortUrl;
    if(slug && req.user){
        const slugExists = await checkSlugExists(slug);
        if(!slugExists) shortUrl = slug;
        else return res.status(400).json({message:"this custom url already exists"})
    }else{
        shortUrl = await generateNanoId(7);
    }
    
    //if user logged in save user id as well
    await saveShortUrl(shortUrl, longUrl, req.user?._id);
    res.status(201).json({short_url:process.env.APP_URL + shortUrl});
});

const redirectFromShortUrl = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    console.log("id:", id);
    
    const shortUrl = await getShortUrl(id);
    if(shortUrl){
        res.redirect(shortUrl.full_url)
    }else{
        res.status(404).json({message:"url not found"})
    }
})

export { createShortUrl, redirectFromShortUrl };
