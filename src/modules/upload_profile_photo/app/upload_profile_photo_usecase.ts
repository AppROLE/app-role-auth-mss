import { User } from "src/shared/domain/entities/user";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { Environments } from "src/shared/environments";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class UploadProfilePhotoUseCase {
  constructor(
    private readonly mongoRepo: IUserRepository,
    private readonly fileRepo: IFileRepository
  ) {}

  async execute(email: string, username: string, profilePhotoPath: string, extensionName: string, mimetype: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }

    if (!User.validateUsername(username)) {
      throw new EntityError("username");
    }

    const imageKey = `${email}-${username}${extensionName}`;

    await this.fileRepo.uploadProfilePhoto(imageKey, profilePhotoPath, mimetype);

    await this.mongoRepo.updateProfilePhoto(email, `${Environments.getEnvs().cloudFrontUrl}/${imageKey}`);
  }
}