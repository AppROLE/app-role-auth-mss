import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { ValidateForgotPasswordCodeUseCase } from "./validate_forgot_password_code_usecase";
import { ValidateForgotPasswordCodeController } from "./validate_forgot_password_code_controller";

const repo = Environments.getUserRepo();
const usecase = new ValidateForgotPasswordCodeUseCase(repo);
const controller = new ValidateForgotPasswordCodeController(usecase);

export async function confirmForgotPasswordPresenter(
  event: Record<string, any>
) {
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
