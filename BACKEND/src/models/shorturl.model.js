import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    full_url:{
        type:String,
        required:true,
    },
    short_url:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    clicks:{
        type:Number,
        required:true,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    qr_code_link:{
        type:String,
        required:false,
    },
    expiresAt: { 
        type: Date, 
        default: null 
  },
    maxClicks: { 
        type: Number, 
        default: null 
  },
    isActive: { 
        type: Boolean, 
        default: true 
      },
    deactivationReason: {
        type: String,
        enum: ["expired", "max_clicks_reached", "manual"],
        default: null,
    },
});

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);

export default shortUrl;