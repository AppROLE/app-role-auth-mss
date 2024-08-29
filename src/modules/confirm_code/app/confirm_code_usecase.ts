import { EntityError } from "../../../shared/helpers/errors/domain_errors";
import { IUserRepository } from "../../../shared/domain/irepositories/user_repository_interface";
import { User } from "../../../shared/domain/entities/user";
import { NoItemsFound } from "../../../shared/helpers/errors/usecase_errors";

export class ConfirmCodeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, code: string): Promise<void> {
    if (!User.validateEmail(email)) {
      throw new EntityError("Email inválido.");
    }
    if (code.trim().length === 0) {
      throw new EntityError("Código de confirmação é obrigatório.");
    }
    if (!email) {
      throw new NoItemsFound("email");
    }
    if (!code) {
      throw new NoItemsFound("code");
    }

    await this.userRepository.confirmCode(email, code);
  }
}
