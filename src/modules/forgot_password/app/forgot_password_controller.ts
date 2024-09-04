import { ForgotPasswordUseCase } from "./forgot_password_usecase";
import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import {
  BadRequest,
  InternalServerError,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  NotFound,
  OK,
  Unauthorized,
} from "src/shared/helpers/external_interfaces/http_codes";
import {
  ConflictItems,
  ForbiddenAction,
  NoItemsFound,
} from "src/shared/helpers/errors/usecase_errors";
import { ForgotPasswordViewmodel } from "./forgot_password_viemodel";

export class ForgotPasswordController {
  constructor(private readonly usecase: ForgotPasswordUseCase) {}

  async handle(request: IRequest) {
    const email = request.data.email;

    try {
      if (!email) {
        throw new MissingParameters("email");
      }

      if (typeof email !== "string") {
        throw new WrongTypeParameters("email", "string", typeof email);
      }

      await this.usecase.execute(email);
      const viewmodel = new ForgotPasswordViewmodel(
        "Uma mensagem de recuperação foi enviada para o seu e-mail"
      );
      return new OK(viewmodel.toJSON());
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
      if (error instanceof ConflictItems) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message as any);
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    }
  }
}
