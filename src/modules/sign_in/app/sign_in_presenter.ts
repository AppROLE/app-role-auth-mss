import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { SignInUseCase } from "./sign_in_usecase";
import { SignInController } from "./sign_in_controller";

const repo = Environments.getAuthRepo();
const usecase = new SignInUseCase(repo);
const controller = new SignInController(usecase);

export async function signInPresenter(event: Record<string, any>) {
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
  const response = await signInPresenter(event);
  return response;
}
