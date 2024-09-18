import { SignInUseCase } from "./sign_in_usecase";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";

import { SignInViewModel } from "./sign_in_viewmodel";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { InvalidCredentialsError } from "src/shared/helpers/errors/login_errors";

export class SignInController {
  constructor(private readonly usecase: SignInUseCase) {}

  async handle(request: IRequest) {
    const email = request.data.email;
    const password = request.data.password;

    try {
      if (!email) {
        throw new MissingParameters("email");
      }

      if (typeof email !== "string") {
        throw new WrongTypeParameters("email", "string", typeof email);
      }

      if (!password) {
        throw new MissingParameters("password");
      }

      if (typeof password !== "string") {
        throw new WrongTypeParameters("password", "string", typeof password);
      }

      const session = await this.usecase.execute(email, password);
      const sessionViewModel = new SignInViewModel(
        session["accessToken"],
        session["idToken"],
        session["refreshToken"]
      );
      return new OK(sessionViewModel.toJSON());
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof InvalidCredentialsError) {
        return new BadRequest(error.message);
      }
      return new InternalServerError(
        `SignInController, Error on handle: ${error.message}`
      );
    }
  }
}
