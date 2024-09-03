import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { ResendCodeController } from "./resend_code_controller";
import { ResendCodeUseCase } from "./resend_code_usecase";

const repo = Environments.getAuthRepo();
const mailRepo = Environments.getMailRepo();
const usecase = new ResendCodeUseCase(repo, mailRepo);
const controller = new ResendCodeController(usecase);

export async function resendCodePresenter(event: Record<string, any>) {
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
  const response = await resendCodePresenter(event);
  return response;
}
