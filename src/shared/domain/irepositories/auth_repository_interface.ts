import { FinishSignUpReturnType } from "src/shared/helpers/types/finish_sign_up_return_type";
import { User } from "../entities/user";
import { ChangeUsernameReturnType } from "src/shared/helpers/types/change_username_return_type";

export interface IAuthRepository {
  forgotPassword(email: string, code: string): Promise<string>;
  getUserByEmail(email: string): Promise<User | undefined>;
  signUp(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ): Promise<{
    user: User;
    code: string;
  }>;
  confirmCode(
    email: string,
    code: string
  ): Promise<{
    user: User;
    code: string;
  }>;
  setUserPassword(email: string, newPassword: string): Promise<void>;
  resendCode(email: string): Promise<string>;
  finishSignUp(
    email: string,
    newUsername: string,
    password: string,
    newNickname?: string
  ): Promise<FinishSignUpReturnType>;
  signIn(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }>;
  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }>;
  deleteAccount(username: string): Promise<void>;
  changeUsername(
    email: string,
    username: string,
    newUsername: string,
    password: string
  ): Promise<ChangeUsernameReturnType | null>

  updateProfile(
    username: string,
    nickname: string
  ): Promise<void>;
  findUserByUsername(username: string): Promise<User | undefined>;
}
