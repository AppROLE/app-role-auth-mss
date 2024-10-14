import { GetProfileReturnType } from "src/shared/helpers/types/get_profile_return_type";
import { User } from "../entities/user";
import { FindPersonReturnType } from "src/shared/helpers/types/find_person_return_type";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  updateProfilePhoto(email: string, profilePhoto: string): Promise<string>;
  getProfile(username: string): Promise<GetProfileReturnType>
  deleteAccount(username: string): Promise<void>;
  findByUsername(username: string): Promise<User>;
  createReview(
    star: number,
    review: string,
    reviewedAt: Date,
    instituteId: string,
    eventId: string,
    username: string
  ): Promise<void>;
  getFriends(username: string): Promise<User[]>;
  getAllReviewsByEvent(eventId: string): Promise<User[]>;
  findPerson(searchTerm: string): Promise<FindPersonReturnType[]>;
  updateProfile(
    username: string,
    newUsername?: string,
    nickname?: string,
    biography?: string,
    instagramLink?: string,
    tiktokLink?: string
  ): Promise<boolean | null>;
  favoriteInstitute(username: string, instituteId: string): Promise<void>;
  followUser(username: string, followedUsername: string): Promise<void>;
}