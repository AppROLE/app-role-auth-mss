import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class FavoriteInstituteUseCase{
    constructor(private readonly repo: IUserRepository) {}

    async execute(username: string, instituteId: string): Promise<void> {

        if (!username) throw new EntityError('Usuário não encontrado')
        if (!instituteId) throw new EntityError('Instituto não encontrado')
        
        await this.repo.favoriteInstitute(username, instituteId)
    }
}