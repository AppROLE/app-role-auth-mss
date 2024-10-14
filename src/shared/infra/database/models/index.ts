import mongoose, { Mongoose, ConnectOptions } from 'mongoose';
import { Environments } from 'src/shared/environments';

let mongoConnection: Mongoose | null = null;

export const connectDB = async (): Promise<Mongoose> => {
  if (mongoConnection) {
    console.log('Reusing existing MongoDB connection');
    return mongoConnection;
  }

  try {
    const { mongoUri, stage } = Environments.getEnvs();
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }

    const uri = `${mongoUri}${stage.toLowerCase()}`;
    console.log('Connecting to MongoDB, uri:', uri);
    
    // Cria a conexão apenas uma vez
    mongoConnection = await mongoose.connect(uri);

    console.log('MongoDB connected');
    return mongoConnection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Lança o erro em vez de usar process.exit()
  }
};
