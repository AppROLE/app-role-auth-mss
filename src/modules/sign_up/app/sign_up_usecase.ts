import { User } from "src/shared/domain/entities/user";
import { IMailRepository } from "src/shared/domain/irepositories/mail_repository_interface";
import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { DuplicatedItem, UserAlreadyExists } from "src/shared/helpers/errors/usecase_errors";

export class SignUpUseCase {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly mailRepo: IMailRepository
  ) {}

  async execute(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ) {
    if (User.validateEmail(email) === false) {
      throw new EntityError("email");
    }

    if (User.validateName(name) === false) {
      throw new EntityError("name");
    }

    if (User.validatePassword(password) === false) {
      throw new EntityError("password");
    }
    if (acceptedTerms !== true) {
      throw new EntityError("acceptedTerms");
    }

    const userAlreadyExists = await this.repo.getUserByEmail(email);

    if (userAlreadyExists) {
      throw new UserAlreadyExists()
    }

    const {user: createdUser, code} = await this.repo.signUp(
      name,
      email,
      password,
      acceptedTerms
    );

    await this.mailRepo.sendMail(
      email,
      "Verificação de conta",
      `Olá ${name}, sua conta foi criada com sucesso! Para confirmar seu cadastro, utilize o código: ${code}`
    );

    return createdUser;
  }
}
