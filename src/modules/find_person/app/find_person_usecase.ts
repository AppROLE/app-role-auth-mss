import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class FindPersonUseCase { 
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(searchTerm: string) {
    const persons = await this.userRepo.findPerson(searchTerm);

    if (persons.length === 0) {
      throw new NoItemsFound('pessoas');
    }

    return persons;
  }
}