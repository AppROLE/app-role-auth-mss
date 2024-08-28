import { User } from "../../../shared/domain/entities/user";
import { EntityError } from "../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../shared/helpers/errors/usecase_errors";
import { IUserRepository } from "../../../shared/domain/irepositories/user_repository_interface";
import { sendEmail } from "../../../shared/utils/mail_sender";

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

    const resetPasswordLink = await this.repo.forgotPassword(email);

    try {
      await sendEmail(
        email,
        "Recuperação de Senha",
        `Acesse esse link para trocar sua senha: ${resetPasswordLink}`
      );
    } catch (error) {
      throw new Error(
        "Não foi possível enviar o e-mail de recuperação de senha."
      );
    }

    return { message: "E-mail de recuperação enviado com sucesso" };
  }
}
