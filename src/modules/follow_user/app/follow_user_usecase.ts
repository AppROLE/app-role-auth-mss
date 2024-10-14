import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class FollowUserUseCase {
    constructor(private readonly repo: IUserRepository) {}

    async execute(username: string, followedUsername: string): Promise<void> {
        if (!username) throw new EntityError('Usuário não encontrado');
        if (!followedUsername) throw new EntityError('Usuário a ser seguido não encontrado');
        
        await this.repo.followUser(username, followedUsername);
    }
}