import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class SignUpUsecase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(name: string, email: string, password: string, acceptedTerms: boolean) {
    const createdUser = await this.repo.signUp(name, email, password, acceptedTerms);
    return createdUser
  }
}