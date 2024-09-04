import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { ResendCodeUseCase } from "./resend_code_usecase";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { ResendCodeViewmodel } from "./resend_code_viewmodel";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class ResendCodeController {
  constructor(private readonly usecase: ResendCodeUseCase) {}

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

      const viewmodel = new ResendCodeViewmodel(
        "Um novo código foi enviado para o seu e-mail!"
      );
      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(
          `ResendCodeController, Error on handle: ${error.message}`
        );
      }
    }
  }
}
