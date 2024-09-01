import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import userModel from "../../database/models/user.model";

export class UserRepositoryMongo implements IUserRepository {
  
  confirmCode(
    email: string,
    code: string
  ): Promise<{ user: User; code: string }> {
    throw new Error("Method not implemented.");
  }

  setUserPassword(email: string, newPassword: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  signUp(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ): Promise<{
    user: User;
    code: string;
  }> {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(email: string): Promise<User | null> {
    return userModel.findOne({
      userEmail: email,
    });
  }

  public async forgotPassword(email: string): Promise<string> {
    const user = await userModel.findOne({
      userEmail: email,
    });

    return `Password reset email sent to ${email}`;
  }
}
