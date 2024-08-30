import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { ConfirmForgotPasswordUsecase } from "./confirm_forgot_password_usecase";
import { OK } from "src/shared/helpers/external_interfaces/http_codes";

export class ConfirmForgotPasswordController {
  constructor(private readonly usecase: ConfirmForgotPasswordUsecase) {}

  async handle(request: IRequest) {
    return new OK({ message: 'Ok' });
  }
}