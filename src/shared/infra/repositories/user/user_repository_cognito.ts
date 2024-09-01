import { generateConfirmationCode } from "../../../utils/generate_confirmation_code";
import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import {
  AdminConfirmSignUpCommand,
  AdminConfirmSignUpCommandInput,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordCommandInput,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
  ListUsersCommand,
  ListUsersCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { NoItemsFound } from "../../../helpers/errors/usecase_errors";

export class UserRepositoryCognito implements IUserRepository {
  userPoolId: string;
  clientId: string;
  client: CognitoIdentityProviderClient;

  constructor(userPoolId: string, clientId: string) {
    this.userPoolId = userPoolId;
    this.clientId = clientId;
    this.client = new CognitoIdentityProviderClient({
      region: "sa-east-1",
    });
  }

  async forgotPassword(email: string, code: string): Promise<string> {
    try {
      await this.updateUserConfirmationCode(email, code);
      return "";

      // set code in user attributes
    } catch (error: any) {
      throw new Error(
        "UserRepositoryCognito, Error on forgotPassword: " + error.message
      );
    }
  }

  async updateUserConfirmationCode(
    email: string,
    confirmationCode: string
  ): Promise<void> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const params: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: this.userPoolId,
      Username: user.userUsername as string, // Utilizando o Username do usuário encontrado
      UserAttributes: [
        {
          Name: "custom:confirmationCode",
          Value: confirmationCode,
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    await this.client.send(command);
  }
  async getUserByEmail(email: string): Promise<User> {
    try {
      const params: ListUsersCommandInput = {
        UserPoolId: this.userPoolId,
        Filter: `email = "${email}"`,
      };
      const command = new ListUsersCommand(params);
      const result = await this.client.send(command);
      if (result.Users && result.Users.length > 0) {
        const user = result.Users[0];
        console.log("USER FROM COGNITO WITHOUT DTO: ", user);
        return new User({
          name: user.Attributes?.find((attr) => attr.Name === "name")
            ?.Value as string,
          email: user.Attributes?.find((attr) => attr.Name === "email")
            ?.Value as string,
          username: user.Username as string,
          nickname: user.Attributes?.find(
            (attr) => attr.Name === "custom:nickname"
          )?.Value as string,
          user_id: user.Attributes?.find((attr) => attr.Name === "sub")
            ?.Value as string,
        });
      } else {
        throw new NoItemsFound("email");
      }
    } catch (error: any) {
      throw new Error(
        "UserRepositoryCognito, Error on getUserByEmail: " + error.message
      );
    }
  }
  async signUp(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ): Promise<User> {
    try {
      const user = new User({
        name,
        email,
        password,
        username: email,
        nickname: name.split(" ")[0],
      });

      const code = generateConfirmationCode();

      const params: SignUpCommandInput = {
        ClientId: this.clientId,
        Password: password,
        Username: email,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "name",
            Value: name,
          },
          {
            Name: "nickname",
            Value: name.split(" ")[0],
          },
          {
            Name: "custom:confirmationCode",
            Value: code,
          },
          {
            Name: "custom:acceptedTerms",
            Value: acceptedTerms ? "true" : "false",
          },
          {
            Name: "custom:roleType",
            Value: user.userRoleType,
          },
        ],
        // ValidationData: [
        //   {
        //     Name: 'SupressEmail',
        //     Value: 'true'
        //   },
        //   {
        //     Name: 'SupressSMS',
        //     Value: 'true'
        //   }
        // ]
      };

      const command = new SignUpCommand(params);
      const result = await this.client.send(command);

      console.log("SIGN UP RESULT: ", result);

      return user;
    } catch (error: any) {
      throw new Error(
        "UserRepositoryCognito, Error on signUp: " + error.message
      );
    }
  }

  async confirmCode(
    email: string,
    code: string
  ): Promise<{ user: User; code: string }> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const params: AdminGetUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: user.userUsername as string,
      };

      const command = new AdminGetUserCommand(params);
      const result = await this.client.send(command);

      const confirmationCode = result.UserAttributes?.find(
        (attr) => attr.Name === "custom:confirmationCode"
      )?.Value;

      if (confirmationCode !== code) {
        throw new Error("Código de confirmação inválido.");
      }

      return { user, code };
    } catch (error: any) {
      throw new Error(
        "UserRepositoryCognito, Error on confirmCode: " + error.message
      );
    }
  }

  async setUserPassword(email: string, newPassword: string): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const params: AdminSetUserPasswordCommandInput = {
        UserPoolId: this.userPoolId,
        Username: user.userUsername as string,
        Password: newPassword,
        Permanent: true,
      };

      const command = new AdminSetUserPasswordCommand(params);
      await this.client.send(command);
    } catch (error: any) {
      throw new Error(
        "UserRepositoryCognito, Error on setUserPassword: " + error.message
      );
    }
  }
}
