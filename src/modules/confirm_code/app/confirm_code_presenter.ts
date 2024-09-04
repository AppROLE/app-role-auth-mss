import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { ConfirmCodeUseCase } from "./confirm_code_usecase";
import { ConfirmCodeController } from "./confirm_code_controller";

const repo = Environments.getAuthRepo();
const usecase = new ConfirmCodeUseCase(repo);
const controller = new ConfirmCodeController(usecase);

export async function confirmCodePresenter(
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
  const response = await confirmCodePresenter(event);
  return response;
}
