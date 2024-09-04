import { DuplicatedItem } from "src/shared/helpers/errors/usecase_errors";
import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import { connectDB } from "../../database/models";
import { IUser, userModel } from "../../database/models/user.model";
import { UserMongoDTO } from "../../dto/user_mongo_dto"
import { v4 as uuidv4 } from 'uuid';

export class UserRepositoryMongo implements IUserRepository { 
  async createUser(user: User): Promise<User> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const dto = UserMongoDTO.fromEntity(user);
      const userDoc = UserMongoDTO.toMongo(dto);

      console.log('MONGO REPO USER DOC: ', userDoc);

      userDoc._id = uuidv4();

      const userAlreadyExists = await userMongoClient?.findOne({ email: user.userEmail });

      if (userAlreadyExists) {
        throw new DuplicatedItem('email');
      }

      const respMongo = await userMongoClient?.insertOne(userDoc);
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);
      console.log('MONGO REPO USER CREATED: ', user);

      return user;
    } catch (error) {
      throw new Error(`Error creating user on MongoDB: ${error}`);
    } finally {
      
    }
  }
}
