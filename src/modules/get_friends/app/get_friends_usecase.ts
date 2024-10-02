import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class GetFriendsUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(username: string) {
    return await this.userRepo.getFriends(username)
  }
}