import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface"
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors"

export class GetAllFavoritesInstitutesUseCase {
    constructor(private readonly repo: IUserRepository) {}

    async execute(username: string): Promise<any> {

        if (!username) throw new NoItemsFound('usuário')
        
        return await this.repo.getAllFavoriteInstitutes(username)
    }
}