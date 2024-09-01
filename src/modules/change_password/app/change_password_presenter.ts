import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { ChangePasswordUseCase } from "./change_password_usecase";
import { ChangePasswordController } from "./change_password_controller";

const repo = Environments.getUserRepo();
const usecase = new ChangePasswordUseCase(repo);
const controller = new ChangePasswordController(usecase);

export async function changePasswordPresenter(event: Record<string, any>) {
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
  const response = await changePasswordPresenter(event);
  return response;
}
