import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { RefreshTokenUseCase } from "./refresh_token_usecase";
import { RefreshTokenController } from "./refresh_token_controller";

const repo = Environments.getAuthRepo();
const usecase = new RefreshTokenUseCase(repo);
const controller = new RefreshTokenController(usecase);

export async function refreshTokenPresenter(
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
  const response = await refreshTokenPresenter(event);
  return response;
}
