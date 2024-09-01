import { User } from "src/shared/domain/entities/user";
import { IMailRepository } from "src/shared/domain/irepositories/mail_repository_interface";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class SignUpUsecase {
  constructor(
    private readonly repo: IUserRepository,
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

    const createdUser = await this.repo.signUp(
      name,
      email,
      password,
      acceptedTerms
    );

    await this.mailRepo.sendMail(
      email,
      "Criação de conta",
      `Olá ${name}, sua conta foi criada com sucesso!`
    );

    return createdUser;
  }
}
