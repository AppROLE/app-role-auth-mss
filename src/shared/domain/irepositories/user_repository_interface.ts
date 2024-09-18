import { GetProfileReturnType } from "src/shared/helpers/types/get_profile_return_type";
import { User } from "../entities/user";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  updateProfilePhoto(email: string, profilePhoto: string): Promise<string>;
  getProfile(username: string): Promise<GetProfileReturnType>
  deleteAccount(username: string): Promise<void>;
}