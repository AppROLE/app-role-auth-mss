import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { FinishSignUpUseCase } from "./finish_sign_up_usecase";
import { FinishSignUpController } from "./finish_sign_up_controller";

const repo = Environments.getAuthRepo();
const userMongoRepo = Environments.getUserRepo();
const usecase = new FinishSignUpUseCase(repo, userMongoRepo);
const controller = new FinishSignUpController(usecase);

export async function finishSignUpPresenter(event: Record<string, any>) {
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
  const response = await finishSignUpPresenter(event);
  return response;
}
