import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { User } from "src/shared/domain/entities/user";

export class ConfirmForgotPasswordUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(email: string, newPassword: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    if (!User.validatePassword(newPassword)) {
      throw new EntityError("password");
    }

    await this.repo.setUserPassword(email, newPassword);

    return { message: "Senha redefinida com sucesso!" };
  }
}
