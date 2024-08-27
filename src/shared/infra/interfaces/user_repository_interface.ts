import { User } from "../../domain/entities/user";

export interface IUserRepository {
  forgotPassword(email: string): Promise<string>;
  getUserByEmail(email: string): Promise<User | null>;
}
