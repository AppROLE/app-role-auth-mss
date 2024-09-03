import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { SignUpController } from "./sign_up_controller";
import { SignUpUseCase } from "./sign_up_usecase";

const repo = Environments.getAuthRepo();
const mailRepo = Environments.getMailRepo();
const usecase = new SignUpUseCase(repo, mailRepo);
const controller = new SignUpController(usecase);

export async function signUpPresenter(event: Record<string, any>) {
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
  const response = await signUpPresenter(event);
  return response;
}
