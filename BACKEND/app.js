import express from "express";
import { nanoid } from "nanoid";
import { configDotenv} from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import urlSchema from "./src/models/shortUrl.model.js";
import shortUrlRouter from "./src/routes/shortUrl.route.js";
import {redirectFromShortUrl} from "./src/controllers/shortUrl.controller.js"
import { errorHandler } from "./src/utils/errorHandler.js";
configDotenv()
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/create",shortUrlRouter)

app.get("/:id",redirectFromShortUrl)
app.use(errorHandler)

app.listen(3000, ()=>{
    // console.log("mongo url:", process.env.MONGO_URL);
    connectDB();
    console.log("server is running on port 3000");
    
})