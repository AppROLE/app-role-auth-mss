import { IUserRepository } from "../../../shared/domain/irepositories/user_repository_interface";
import { NoItemsFound } from "../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../shared/helpers/errors/domain_errors";
import { User } from "../../../shared/domain/entities/user";

export class ConfirmForgotPasswordUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> {
    if (!email || !User.validateEmail(email)) {
      throw new EntityError("email");
    }

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NoItemsFound("this user");
    }

    const isCodeValid = await this.userRepository.confirmForgotPassword(
      user,
      code,
      newPassword
    );

    if (!isCodeValid) {
      throw new EntityError("Invalid or expired confirmation code");
    }
  }
}
