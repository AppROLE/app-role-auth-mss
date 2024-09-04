import { envs } from "../../../helpers/envs/envs";
import mongoose, { Mongoose } from "mongoose";
import User from "./user.model";


const connectDB = async () => {
  try {
    if (!envs.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    console.log("Connecting to MongoDB");
    console.log("MONGO_URI", envs.MONGO_URI);
    const mongoSession = await mongoose.connect(envs.MONGO_URI)

    console.log("MongoDB connected");
    return mongoSession;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export { connectDB, User };
