import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { DuplicatedItem, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class UpdateProfileUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(
    email: string,
    username: string,
    newUsername?: string,
    password?: string,
    nickname?: string,
    biography?: string,
    instagramLink?: string,
    tiktokLink?: string
  ) {
    console.log('UPDATE PROFILE USECASE: email', email);
    console.log('UPDATE PROFILE USECASE: username', username);
    console.log('UPDATE PROFILE USECASE: newUsername', newUsername);
    console.log('UPDATE PROFILE USECASE: password', password);
    console.log('UPDATE PROFILE USECASE: nickname', nickname);
    console.log('UPDATE PROFILE USECASE: biography', biography);
    console.log('UPDATE PROFILE USECASE: instagramLink', instagramLink);
    console.log('UPDATE PROFILE USECASE: tiktokLink', tiktokLink);


    if (newUsername && password) {
      const usernameAlreadyExists = await this.authRepo.findUserByUsername(newUsername);
      if (usernameAlreadyExists) throw new DuplicatedItem('username');
      const resp = await this.authRepo.changeUsername(email, username, newUsername, password); 
      if (!resp) throw new NoItemsFound('usuário');
    }
    if (newUsername && nickname) {
      await this.authRepo.updateProfile(newUsername, nickname)
    }
    if (nickname) {
      await this.authRepo.updateProfile(username, nickname)
    }

    if (newUsername || nickname || biography || instagramLink || tiktokLink) {
      const isUpdated = await this.userRepo.updateProfile(
        username,
        newUsername,
        nickname,
        biography,
        instagramLink,
        tiktokLink
      );

      if (isUpdated === null) throw new NoItemsFound('usuário');

    }

  }
}