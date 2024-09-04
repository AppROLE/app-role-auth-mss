import { generateConfirmationCode } from "../../../utils/generate_confirmation_code";
import { User } from "../../../domain/entities/user";
import { IAuthRepository } from "../../../domain/irepositories/auth_repository_interface";
import {
  AdminConfirmSignUpCommand,
  AdminConfirmSignUpCommandInput,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandInput,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordCommandInput,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  ListUsersCommand,
  ListUsersCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { FinishSignUpReturnType } from "src/shared/helpers/types/finish_sign_up_return_type";
import { InvalidCredentialsError } from "src/shared/helpers/errors/login_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class AuthRepositoryCognito implements IAuthRepository {
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

  async resendCode(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);

    const code = generateConfirmationCode();

    const params: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: this.userPoolId,
      Username: user?.userUsername as string,
      UserAttributes: [
        {
          Name: "custom:confirmationCode",
          Value: code,
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    await this.client.send(command);

    return code;
  }

  async forgotPassword(email: string, code: string): Promise<string> {
    try {
      await this.updateUserConfirmationCode(email, code);
      return "";

      // set code in user attributes
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on forgotPassword: " + error.message
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
      Username: user.userUsername as string,
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
  async getUserByEmail(email: string): Promise<User | undefined> {
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
      }
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on getUserByEmail: " + error.message
      );
    }
  }
  async signUp(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ): Promise<{
    user: User;
    code: string;
  }> {
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

      return {
        user,
        code,
      };
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on signUp: " + error.message
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

      const isUserEmailVerified = result.UserAttributes?.find(
        (attr) => attr.Name === "email_verified"
      )?.Value;

      if (confirmationCode !== code) {
        throw new EntityError("code");
      }

      if (isUserEmailVerified === "false") {
        const paramsConfirmEmail: AdminUpdateUserAttributesCommandInput = {
          UserPoolId: this.userPoolId,
          Username: user.userUsername as string,
          UserAttributes: [
            {
              Name: "email_verified",
              Value: "true",
            },
          ],
        };

        const commandConfirmEmail = new AdminUpdateUserAttributesCommand(
          paramsConfirmEmail
        );
        await this.client.send(commandConfirmEmail);

        const paramsAdminConfirmSignUp: AdminConfirmSignUpCommandInput = {
          UserPoolId: this.userPoolId,
          Username: user.userUsername as string,
        };
  
        await this.client.send(
          new AdminConfirmSignUpCommand(paramsAdminConfirmSignUp)
        );
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
        "AuthRepositoryCognito, Error on setUserPassword: " + error.message
      );
    }
  }

  async finishSignUp(
    email: string,
    newUsername: string,
    password: string,
    newNickname: string,
  ): Promise<FinishSignUpReturnType> {
    try {
      console.log("INITIATING FINISH SIGN UP REPO");
      console.log("FINISH SIGN UP REPO", email, newUsername, newNickname);
      const user = await this.getUserByEmail(email);
      const emailUsername = user?.userUsername;

      console.log("PASSWORD REPO COGNITO: ", password);

      const params: AdminGetUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: emailUsername as string,
      };

      const command = new AdminGetUserCommand(params);
      const result = await this.client.send(command);
      console.log("FINISH SIGN UP RESULT FROM GET USER: ", result);
      const allAttributtesOfUser = {
        email,
        newUsername,
        newNickname,
        acceptedTerms: result.UserAttributes?.find(
          (attr) => attr.Name === "custom:acceptedTerms"
        )?.Value,
        roleType: result.UserAttributes?.find(
          (attr) => attr.Name === "custom:roleType"
        )?.Value,
        name: result.UserAttributes?.find((attr) => attr.Name === "name")
          ?.Value as string,
      };

      console.log('password', password)

      const paramsToRealSignUp: SignUpCommandInput = {
        ClientId: this.clientId,
        Password: password,
        Username: newUsername,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "name",
            Value: allAttributtesOfUser.name,
          },
          {
            Name: "nickname",
            Value: newNickname,
          },
          {
            Name: "custom:acceptedTerms",
            Value: allAttributtesOfUser.acceptedTerms,
          },
          {
            Name: "custom:roleType",
            Value: allAttributtesOfUser.roleType,
          },
        ],
      };

      const commandToRealSignUp = new SignUpCommand(paramsToRealSignUp);
      console.log("COMMAND TO REAL SIGN UP: ", commandToRealSignUp);
      const resultRealSignUp = await this.client.send(commandToRealSignUp);

      console.log("FINISH SIGN UP RESULT FROM REAL SIGN UP: ", resultRealSignUp);

      await this.client.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: this.userPoolId,
          Username: newUsername,
        })
      );

      const paramsConfirmEmail: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: this.userPoolId,
        Username: newUsername,
        UserAttributes: [
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
      };

      const commandConfirmEmail = new AdminUpdateUserAttributesCommand(
        paramsConfirmEmail
      );
      await this.client.send(commandConfirmEmail);

      await this.client.send(
        new AdminDeleteUserCommand({
          UserPoolId: this.userPoolId,
          Username: emailUsername as string,
        })
      );

      console.log('CHEGOU NO FINAL DO FINISH SIGN UP REPO')

      return allAttributtesOfUser;
    } catch (error: any) {
      throw new Error(
        "AuthRepositoryCognito, Error on finishSignUp: " + error.message
      );
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new NoItemsFound("email");
      }

      const username = user.userUsername as string;

      const params: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      };

      const command = new AdminInitiateAuthCommand(params);
      const result = await this.client.send(command);

      if (!result.AuthenticationResult) {
        console.error(
          "AuthenticationResult is missing in the response:",
          result
        );
        throw new Error(
          "Authentication failed, no tokens returned"
        );
      }

      const { AccessToken, IdToken, RefreshToken } =
        result.AuthenticationResult;

      return {
        accessToken: AccessToken || "",
        idToken: IdToken || "",
        refreshToken: RefreshToken || "",
      };
    } catch (error: any) {
      const errorCode = error?.name || "";
      console.error(
        `Error during signIn: ${error.message}, Code: ${errorCode}`
      );
      if (
        errorCode === "NotAuthorizedException" ||
        errorCode === "UserNotFoundException"
      ) {
        throw new NoItemsFound("email");
      } else if (errorCode === "UserNotConfirmedException") {
        throw new Error("User not confirmed");
      } else if (errorCode === "ResourceNotFoundException") {
        throw new NoItemsFound("User");
      } else {
        throw new Error(
          "An unexpected error occurred during login"
        );
      }
    }
  }
}
