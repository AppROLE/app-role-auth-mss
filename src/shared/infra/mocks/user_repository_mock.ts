import { User } from "../../domain/entities/user";
import { UserMock } from "../../domain/mocks/user_mock";
import { IUserRepository } from "../interfaces/user_repository_interface";

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
      return null;
    }
    return user;
  }
}
