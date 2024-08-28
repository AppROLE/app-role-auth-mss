import { generateConfirmationCode } from "@/shared/utils/generate_confirmation_code";
import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"


export class UserRepositoryCognito implements IUserRepository {
  userPoolId: string;
  clientId: string;
  client: CognitoIdentityProviderClient;

  constructor(userPoolId: string, clientId: string) {
    this.userPoolId = userPoolId;
    this.clientId = clientId;
    this.client = new CognitoIdentityProviderClient(
      {
        region: 'sa-east-1'
      }
    );
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const code = generateConfirmationCode()

      // set code in user attributes
    } catch (error) {}

  }
  getUserByEmail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  signUp(name: string, email: string, password: string, acceptedTerms: boolean): Promise<User> {
    throw new Error("Method not implemented.");
  }
}