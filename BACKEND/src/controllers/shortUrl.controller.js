import { generateNanoId, handleClicksExpiry, handleDateExpiry } from "../utils/helper.js";
import { checkSlugExists, saveShortUrl } from "../dao/shortUrl.js";
import { getShortUrl } from "../dao/shortUrl.js";
import {asyncHandler} from "../utils/tryCatchWrapper.js";
import { saveClickData } from "../utils/clickData.js";

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

// TODO: test geoip after deployment
const redirectFromShortUrl = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    console.log("id:", id);
    const shortUrl = await getShortUrl(id);
    if(shortUrl){
        // console.log("short_url", shortUrl);
        const dateExpired = await handleDateExpiry(shortUrl);
        if(dateExpired) return res.redirect(`${process.env.FRONTEND_URL}/error?reason=expired`);
        
        const clicksExpired = await handleClicksExpiry(shortUrl);
        if(clicksExpired) return res.redirect(`${process.env.FRONTEND_URL}/error?reason=max_clicks`);
        await saveClickData(req, shortUrl);

        res.redirect(shortUrl.full_url)
    }else{
        // res.status(404).json({message:"url not found"})
        return res.redirect(`${process.env.FRONTEND_URL}/error?reason=not_found`);
    }
})

export { createShortUrl, redirectFromShortUrl };
