import mongoose from "mongoose";

// console.log("mongo url:", process.env.MONGO_URL);

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log("mongoDB connection successfully: ", connect.connection.host);
  } catch (error) {
    console.log("error occured while connecting to mongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
