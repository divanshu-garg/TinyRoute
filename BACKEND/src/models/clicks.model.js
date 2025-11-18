import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    short_url_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"shortUrl",
        required:true,
        index:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
        index:true,
    },
    timestamp:{
        type:Date,
        default: Date.now,
        index:true,
    },
    device_type:{
        type:String,
        enum: ['desktop', 'mobile', 'tablet', 'unknown'],
        default:"unknown",
    },
    region: {
        type:String,
        default:"unknown",
    },
    city:{
        type:String,
        default:"unknown",
    },
    country:{
        type:String,
        default:"unknown",
    },
    country_code:{
        type:String,
        default:"XX",
    },
    // ip address to check unique visitors
    ip_address:{
        type:String, // hash it then store
        default:"unknown",
    },
    referrer:{
        type:String, 
        default: "direct"
    },
    browser:{
        type:String,
        default:"unknown",
    }
})

clickSchema.index({ short_url_id: 1, timestamp: -1 });

const Click = mongoose.model("Click", clickSchema);

export default Click;