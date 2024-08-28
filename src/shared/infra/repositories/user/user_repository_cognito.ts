import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/irepositories/user_repository_interface";

export class UserRepositoryCognito implements IUserRepository {
  forgotPassword(email: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  signUp(name: string, email: string, password: string, acceptedTerms: boolean): Promise<User> {
    throw new Error("Method not implemented.");
  }
}