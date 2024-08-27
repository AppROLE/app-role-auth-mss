import { NoItemsFound } from "../../../shared/helpers/errors/usecase_errors";
import { IUserRepository } from "../../../shared/infra/interfaces/user_repository_interface";

export class ForgotPasswordUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NoItemsFound("this user");
    }
    return this.userRepository.forgotPassword(email);
  }
}
