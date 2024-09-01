import { User } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/irepositories/user_repository_interface";
import { EntityError } from "../../../shared/helpers/errors/domain_errors";

export class ValidateForgotPasswordCodeUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(email: string, code: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    if (!code || code.length < 4 || code.length > 20) {
      throw new EntityError("code");
    }

    const { user, code: confirmationCode } = await this.repo.confirmCode(
      email,
      code
    );

    return { message: "Código validado com sucesso!", user, confirmationCode };
  }
}
