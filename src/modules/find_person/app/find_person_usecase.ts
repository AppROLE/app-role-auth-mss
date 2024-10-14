import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class FindPersonUseCase { 
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(searchTerm: string) {
    const persons = await this.userRepo.findPerson(searchTerm);

    return persons;
  }
}