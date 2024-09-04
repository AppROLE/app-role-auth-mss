import { User } from "../entities/user";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  updateProfilePhoto(email: string, profilePhoto: string): Promise<string>;
}