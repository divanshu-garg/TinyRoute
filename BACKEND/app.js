import express from "express";
import { configDotenv} from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRouter from "./src/routes/shortUrl.route.js";
// import router from "./src/routes/auth.route.js";
import authRouter from "./src/routes/auth.routes.js"
import userRouter from "./src/routes/user.routes.js"
import qrRouter from "./src/routes/qr.routes.js"
import analyticsRouter from "./src/routes/analytics.routes.js"
import {redirectFromShortUrl} from "./src/controllers/shortUrl.controller.js"
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { attachUserMiddleware } from "./src/middleware/auth.middleware.js";
configDotenv()

const handleCorsOrigin = (frontendUrl)=>{
    // if frontend url has / in end remove it to make sure no cors mismatch happens
    if(frontendUrl.endsWith("/")){
        return frontendUrl.slice(0, -1);
    }
    return frontendUrl;
}

const app = express();
app.set("trust proxy", true)
app.use(cors({
    origin: [handleCorsOrigin(process.env.FRONTEND_URL), "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(attachUserMiddleware)
app.use("/api/auth", authRouter)
app.use("/api/create",shortUrlRouter)
app.use("/api/user", userRouter)
app.use("/api/qr", qrRouter)
app.use("/api/analytics", analyticsRouter)
app.get("/:id",redirectFromShortUrl)
app.use(errorHandler)

// app.listen(process.env.PORT, ()=>{
//     // console.log("mongo url:", process.env.MONGO_URL);
//     connectDB();
//     console.log("server is running on port 3000");
    
// })

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected ✔");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();