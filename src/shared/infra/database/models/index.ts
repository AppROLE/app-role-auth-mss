import { envs } from "../../../helpers/envs/envs";
import mongoose from "mongoose";
import User from "./user.model";


const connectDB = async () => {
  try {
    if (!envs.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(envs.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export { connectDB, User };
