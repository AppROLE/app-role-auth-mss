import { DuplicatedItem, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import { connectDB } from "../../database/models";
import { IUser } from "../../database/models/user.model";
import { UserMongoDTO } from "../../database/dtos/user_mongo_dto"
import { v4 as uuidv4 } from 'uuid';
import { GetProfileReturnType } from "src/shared/helpers/types/get_profile_return_type";

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

  async updateProfilePhoto(email: string, profilePhotoUrl: string): Promise<string> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ email });

      if (!userDoc) {
        throw new NoItemsFound('email');
      }

      userDoc.profile_photo = profilePhotoUrl;

      const respMongo = await userMongoClient?.updateOne({ email }, { $set: userDoc });
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);

      return profilePhotoUrl;

    } catch (error) {
      throw new Error(`Error updating profile photo on MongoDB: ${error}`);
    } 

  }

  async getProfile(username: string): Promise<GetProfileReturnType> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ username });

      if (!userDoc) {
        throw new NoItemsFound('username');
      }

      const userDto = UserMongoDTO.fromMongo(userDoc);
      const user = UserMongoDTO.toEntity(userDto);

      const following: number = user.userFollowing.length;
      let followers = await userMongoClient?.countDocuments({ following: { $elemMatch: { user_followed_id: user.userId } } });
      if (!followers) {
        followers = 0;
      }

      return {
        userId: user.userId as string,
        username: user.userUsername,
        name: user.userName,
        linkTiktok: user.userlinkTiktok,
        linkInstagram: user.userlinkInstagram,
        following,
        followers
      };

    } catch (error) {
      throw new Error(`Error getting profile on MongoDB: ${error}`);
    }
  }
}
