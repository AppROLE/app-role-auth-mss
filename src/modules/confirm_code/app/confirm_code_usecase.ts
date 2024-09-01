import { User } from "src/shared/domain/entities/user";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class ConfirmCodeUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(email: string, code: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    if (!code || code.length < 4 || code.length > 20) {
      throw new EntityError("code");
    }

    const result = await this.repo.confirmCode(
      email,
      code
    );

    const codeFromCognito = result.code
    const user = result.user

    return { message: "Código validado com sucesso!", user, codeFromCognito };
  }
}
