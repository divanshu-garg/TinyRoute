import express from "express";
import { nanoid } from "nanoid";
import { configDotenv} from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import urlSchema from "./src/models/shorturl.model.js";
configDotenv()
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.post("/api/create" ,(req,res)=>{
    const {url} = req.body
    console.log(url);
    const shortUrl = nanoid(7);
    const newUrl = new urlSchema({
        full_url:url,
        short_url:shortUrl
    })
    newUrl.save();
    res.send(shortUrl);
})

app.get("/url/:id",async (req,res)=>{
    const {id} = req.params;
    const shortUrl = await urlSchema.findOne({short_url:id})
    if(shortUrl){
        res.redirect(shortUrl.full_url)
    }else{
        res.sendStatus(404).json({message:"url not found"})
    }
})

app.listen(3000, ()=>{
    // console.log("mongo url:", process.env.MONGO_URL);
    connectDB();
    console.log("server is running on port 3000");
    
})