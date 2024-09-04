import { envs } from "../../../helpers/envs/envs";
import mongoose, { Mongoose } from "mongoose";
import User from "./user.model";
import { Environments } from "src/shared/environments";


let mongoConnection: Mongoose | null = null;

export const connectDB = async (): Promise<Mongoose> => {
  if (mongoConnection) {
    console.log("Reusing existing MongoDB connection");
    return mongoConnection;
  }
  
  try {
    if (!Environments.getEnvs().mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }
    const stage = Environments.getEnvs().stage.toLowerCase();
    const uri = Environments.getEnvs().mongoUri + stage

    console.log("Connecting to MongoDB, uri: ", uri);
    console.log("Connecting to MongoDB, stage: ", stage);
    
    mongoConnection = await mongoose.connect(Environments.getEnvs().mongoUri + envs.STAGE.toLowerCase());
    console.log("MongoDB connected");

    return mongoConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // Exit process on failure
  }
};

export { User };
