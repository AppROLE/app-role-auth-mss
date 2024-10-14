import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class GetAllFollowersUseCase {
    constructor(private repo: IUserRepository) {}

    async execute(username: string) {
        return await this.repo.getAllFollowers(username);
    }
}