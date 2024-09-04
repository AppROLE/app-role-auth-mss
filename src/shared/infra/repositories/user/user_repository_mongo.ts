import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import { connectDB } from "../../database/models";
import { IUser, userModel } from "../../database/models/user.model";
import { UserMongoDTO } from "../../dto/user_mongo_dto"

export class UserRepositoryMongo implements IUserRepository { 
  async createUser(user: User): Promise<User> {
    try {
      const db = await connectDB();
      console.log('MONGO REPO DB: ', db);
      db.connections[0].on('error', console.error.bind(console, 'connection error:'));

      db.connections[0].once('open', function() {
        console.log('MONGO REPO DB CONNECTION OPEN');
      })

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const dto = UserMongoDTO.fromEntity(user);
      const userDoc = UserMongoDTO.toMongo(dto);

      console.log('MONGO REPO USER DOC: ', userDoc);

      const respMongo = await userMongoClient?.insertOne(userDoc);
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);
      console.log('MONGO REPO USER CREATED: ', user);

      return user;
    } catch (error) {
      throw new Error(`Error creating user on MongoDB: ${error}`);
    }
  }
}
