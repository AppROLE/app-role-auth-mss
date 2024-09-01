import {
  MissingParameters,
  WrongTypeParameters,
} from "src/shared/helpers/errors/controller_errors";
import { IRequest } from "../../../shared/helpers/external_interfaces/external_interface";
import {
  OK,
  BadRequest,
  InternalServerError,
} from "../../../shared/helpers/external_interfaces/http_codes";
import { ChangePasswordUseCase } from "./change_password_usecase";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { ChangePasswordViewmodel } from "./change_password_viewmodel";

export class ChangePasswordController {
  constructor(private readonly usecase: ChangePasswordUseCase) {}

  async handle(request: IRequest) {
    const email = request.data.email;
    const newPassword = request.data.newPassword;

    if (!email) {
      throw new MissingParameters("email");
    }

    if (!newPassword) {
      throw new MissingParameters("newPassword");
    }

    if (typeof email !== "string") {
      throw new WrongTypeParameters("email", "string", typeof email);
    }

    if (typeof newPassword !== "string") {
      throw new WrongTypeParameters(
        "newPassword",
        "string",
        typeof newPassword
      );
    }

    try {
      await this.usecase.execute(email, newPassword);
      const viewmodel = new ChangePasswordViewmodel(
        "Código validado com sucesso!"
      );
      return new OK({ viewmodel });
    } catch (error: any) {
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
