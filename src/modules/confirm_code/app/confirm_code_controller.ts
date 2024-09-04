import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import {
  OK,
  BadRequest,
  NotFound,
  InternalServerError,
} from "src/shared/helpers/external_interfaces/http_codes";
import { ConfirmCodeUseCase } from "./confirm_code_usecase";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { ConfirmCodeViewmodel } from "./confirm_code_viewmodel";

export class ConfirmCodeController {
  constructor(private readonly usecase: ConfirmCodeUseCase) {}

  async handle(request: IRequest) {
    const email = request.data.email;
    const code = request.data.code;

    try {
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

      await this.usecase.execute(email, code);
      const viewmodel = new ConfirmCodeViewmodel(
        "Código validado com sucesso!"
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
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      return new InternalServerError(error.message);
    }
  }
}
