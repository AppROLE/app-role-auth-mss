import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { ConfirmForgotPasswordUseCase } from "./confirm_forgot_password_usecase";
import { ConfirmForgotPasswordController } from "./confirm_forgot_password_controller";

const repo = Environments.getUserRepo();
const usecase = new ConfirmForgotPasswordUseCase(repo);
const controller = new ConfirmForgotPasswordController(usecase);

export async function confirmForgotPasswordPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}

export async function lambda_handler(event: any, context: any) {
  const response = await confirmForgotPasswordPresenter(event);
  return response;
}
