import { User } from "../../../shared/domain/entities/user";
import { EntityError } from "../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../shared/helpers/errors/usecase_errors";
import { IUserRepository } from "../../../shared/domain/irepositories/user_repository_interface";

export class ForgotPasswordUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(email: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    const user = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new NoItemsFound("this user");
    }

    return this.repo.forgotPassword(email);
  }
}
