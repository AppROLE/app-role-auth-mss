import { User } from "../../domain/entities/user";
import { UserMock } from "../../domain/mocks/user_mock";
import { IUserRepository } from "../../domain/irepositories/user_repository_interface";
import { NoItemsFound } from "../../helpers/errors/usecase_errors";

export class UserRepoMock implements IUserRepository {
  public user_mock: UserMock;

  constructor() {
    this.user_mock = new UserMock();
  }

  /**
   * Simulates the forgot password process for a given email.
   * @param email The email of the user who forgot their password.
   * @returns A promise that resolves with a message indicating the result.
   */

  async forgotPassword(email: string): Promise<string> {
    const user = this.user_mock.users.find((user) => user.userEmail === email);
    if (!user) {
      return "No user found with that email address.";
    }
    return `A password reset link has been sent to ${email}. Please check your inbox to proceed with resetting your password.`;
  }

  /**
   * Retrieves a user by their email.
   * @param email The email of the user to retrieve.
   * @returns A promise that resolves with the user, or null if no user is found.
   */

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.user_mock.users.find((user) => user.userEmail === email);
    if (!user) {
      throw new NoItemsFound('email')
    }
    return user;
  }

  /**
   * Registers a new user.
   * @param name The name of the user.
   * @param email The email of the user.
   * @param password The password of the user.
   * @param acceptedTerms A boolean indicating whether the user has accepted the terms and conditions.
   * @returns A promise that resolves with the newly registered user.
   */

  async signUp(name: string, email: string, password: string, acceptedTerms: boolean): Promise<User> {
    const newUser = {
      userName: name,
      userEmail: email,
      userPassword: password,
      userAcceptedTerms: acceptedTerms
    }

    const user = this.user_mock.users.find((user) => user.userEmail === email);

    if (user) {
      return user;
    }

    const u: any = new User({
      name: newUser.userName,
      email: newUser.userEmail,
      password: newUser.userPassword,
      username: 'digao03',
      nickname: 'digao',
    });
    this.user_mock.users.push(u);

    return u;

    
  }
}
