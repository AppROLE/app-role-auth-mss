import { User } from "src/shared/domain/entities/user";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IAuthRepository } from "src/shared/domain/irepositories/auth_repository_interface";
import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class FinishSignUpUseCase {
  constructor(
    private repo: IAuthRepository,
    private mongoUserRepo: IUserRepository  
  ) {}

  async execute(email: string, newUsername: string, password: string, newNickname?: string,) {
    if (!User.validateEmail(email)) {
      throw new EntityError("email");
    }
    if (!User.validateUsername(newUsername)) {
      throw new EntityError("username");
    }
    if (newNickname && !User.validateNickname(newNickname)) {
      throw new EntityError("nickname");
    }
    if (!User.validatePassword(password)) {
      throw new EntityError("password");
    }

    const userInfos = await this.repo.finishSignUp(email, newUsername, password, newNickname);

    const userToMongo = new User({
      email: userInfos.email,
      name: userInfos.name,
      username: userInfos.newUsername,
      nickname: userInfos.newNickname,
      privacy: PRIVACY_TYPE.PUBLIC,
    })

    await this.mongoUserRepo.createUser(userToMongo);

    console.log('FINSIH SIGN UP USECASE AFTER MONGO CREATE USER');

    const tokens = await this.repo.signIn(email, password);

    console.log('FINSIH SIGN UP USECASE TOKENS: ', tokens);

    return tokens;

  }
}