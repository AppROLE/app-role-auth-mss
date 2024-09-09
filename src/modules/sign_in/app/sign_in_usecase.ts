import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { User } from "src/shared/domain/entities/user";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { InvalidCredentialsError } from "src/shared/helpers/errors/login_errors";

export class SignInUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(email: string, password: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }
    if (!User.validatePassword(password)) {
      throw new EntityError("password");
    }

    const session = await this.repo.signIn(email, password);

    if (!session) {
      throw new InvalidCredentialsError();
    }
    return session;
  }
}
