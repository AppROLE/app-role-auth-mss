import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";

export class RefreshTokenUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(refreshToken: string) {
    const { accessToken, refreshToken: newRefreshToken, idToken } = await this.repo.refreshToken(refreshToken);
    return { accessToken, refreshToken: newRefreshToken, idToken };
  }
}