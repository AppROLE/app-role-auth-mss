import { User } from "../entities/user";

export interface IUserRepository {
  forgotPassword(email: string, code: string): Promise<string>;
  getUserByEmail(email: string): Promise<User | null>;
  signUp(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ): Promise<User>;
}
