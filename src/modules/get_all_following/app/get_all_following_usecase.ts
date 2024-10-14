import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class GetAllFollowingUseCase {
    constructor(private repo: IUserRepository) {}

    async execute(username: string) {
        return await this.repo.getAllFollowing(username);
    }
}