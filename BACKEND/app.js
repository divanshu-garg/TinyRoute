import express from "express";
import { nanoid } from "nanoid";
import { configDotenv} from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import urlSchema from "./src/models/shortUrl.model.js";
import shortUrlRouter from "./src/routes/shortUrl.route.js";
// import router from "./src/routes/auth.route.js";
import authRouter from "./src/routes/auth.routes.js"
import {redirectFromShortUrl} from "./src/controllers/shortUrl.controller.js"
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { attachUserMiddleware } from "./src/middleware/auth.middleware.js";
configDotenv()

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(attachUserMiddleware)
app.use("/api/auth", authRouter)
app.use("/api/create",shortUrlRouter)

app.get("/:id",redirectFromShortUrl)
app.use(errorHandler)

app.listen(3000, ()=>{
    // console.log("mongo url:", process.env.MONGO_URL);
    connectDB();
    console.log("server is running on port 3000");
    
})