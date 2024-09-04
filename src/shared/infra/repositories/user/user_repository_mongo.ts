import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import { connectDB } from "../../database/models";
import userModel from "../../database/models/user.model";
import { UserMongoDTO } from "../../dto/user_mongo_dto"

export class UserRepositoryMongo implements IUserRepository { 
  async createUser(user: User): Promise<User> {
    try {
      await connectDB();

      const dto = UserMongoDTO.fromEntity(user);
      const userDoc = UserMongoDTO.toMongo(dto);

      await userModel.create(userDoc);

      return user;
    } catch (error) {
      throw new Error(`Error creating user on MongoDB: ${error}`);
    }
  }
}
