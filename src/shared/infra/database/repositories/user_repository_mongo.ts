import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import userModel from "../models/user.model";

export class UserRepositoryMongo implements IUserRepository {
  getUserByEmail(email: string): Promise<User | null> {
    return userModel.findOne({
      userEmail: email,
    });
  }

  // talvez seja cortado caso a função seja implementada 100% no mongol
  public async forgotPassword(email: string): Promise<string> {
    const user = await userModel.findOne({
      userEmail: email,
    });

    // lógica de mandar o email seus pepeco, será nodemailer ou cognito?

    return `Password reset email sent to ${email}`;
  }
}
