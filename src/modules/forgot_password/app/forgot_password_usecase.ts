import { User } from "../../../shared/domain/entities/user";
import { EntityError } from "../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../shared/helpers/errors/usecase_errors";
import { IUserRepository } from "../../../shared/domain/irepositories/user_repository_interface";
import { IMailRepository } from "../../../shared/domain/irepositories/mail_repository_interface";
import { generateConfirmationCode } from "../../../shared/utils/generate_confirmation_code";

export class ForgotPasswordUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly mailRepo: IMailRepository
  ) {}

  async execute(email: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    const user = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new NoItemsFound("this email");
    }

    const code = generateConfirmationCode();

    await this.repo.forgotPassword(email, code);
    await this.mailRepo.sendMail(
      email,
      "Recuperação de Senha",
      `Codigo de recuperacao: ${code}`
    );

    return { message: "E-mail de recuperação enviado com sucesso" };
  }
}
