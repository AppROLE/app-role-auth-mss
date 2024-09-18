import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { UserNotRegistered } from "src/shared/helpers/errors/usecase_errors";

export class DeleteAccountUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(username: string, email: string) {
    const userExists = await this.authRepo.getUserByEmail(email);
                      
    if (!userExists) {
      throw new UserNotRegistered();
    }

    await this.authRepo.deleteAccount(username);
    await this.userRepo.deleteAccount(username);
  }
}