import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class GetProfileUseCase {
  constructor(private readonly mongoRepo: IUserRepository) {}

  async execute(username: string) {
    return await this.mongoRepo.getProfile(username);
  }
}