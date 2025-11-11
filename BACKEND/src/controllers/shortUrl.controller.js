import { generateNanoId } from "../utils/helper.js";
import { saveShortUrl } from "../dao/shortUrl.js";
import { getShortUrl } from "../dao/shortUrl.js";
import {asyncHandler} from "../utils/tryCatchWrapper.js";

const createShortUrl = asyncHandler( async (req, res, next) => {
    const { url } = req.body;
    console.log(url);
    // const shortUrl = "KGoPAkS";
    const shortUrl = await generateNanoId(7);
    await saveShortUrl(shortUrl, url);
    res.status(200).json({short_url:process.env.APP_URL + shortUrl});
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
