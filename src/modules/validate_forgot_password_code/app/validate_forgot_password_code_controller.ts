import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { IRequest } from "../../../shared/helpers/external_interfaces/external_interface";
import {
  OK,
  BadRequest,
  NotFound,
  InternalServerError,
} from "../../../shared/helpers/external_interfaces/http_codes";
import { ValidateForgotPasswordCodeUseCase } from "./validate_forgot_password_code_usecase";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { ValidateForgotPasswordCodeViewmodel } from "./validate_forgot_password_code_viewmodel";

export class ValidateForgotPasswordCodeController {
  constructor(private readonly usecase: ValidateForgotPasswordCodeUseCase) {}

  async handle(request: IRequest) {
    const email = request.data.email;
    const code = request.data.code;

    if (!email) {
      throw new MissingParameters("email");
    }
    if (!code) {
      throw new MissingParameters("code");
    }

    if (typeof email !== "string") {
      throw new WrongTypeParameters("email", "string", typeof email);
    }

    if (typeof code !== "string") {
      throw new WrongTypeParameters("code", "string", typeof code);
    }

    try {
      await this.usecase.execute(email, code);
      const viewmodel = new ValidateForgotPasswordCodeViewmodel(
        "Código validado com sucesso!"
      );
      return new OK({ viewmodel });
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      return new InternalServerError(error.message);
    }
  }
}
