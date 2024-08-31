import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class ConfirmForgotPasswordUsecase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(email: string, code: string, newPassword: string) {
    return "Ok";
  }
}
