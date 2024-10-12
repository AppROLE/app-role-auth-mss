import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetProfileUseCase } from "./get_profile_usecase";
import { GetProfileController } from "./get_profile_controller";

const repo = Environments.getUserRepo();
const usecase = new GetProfileUseCase(repo);
const controller = new GetProfileController(usecase);

export async function getProfilePresenter(
  event: Record<string, any>
) {
  const httpRequest = new LambdaHttpRequest(event);
  console.log('event.requestContext', event.requestContext);
  console.log('event.requestContext.authorizer.claims', event.requestContext.authorizer.claims);
  console.log('httpRequest', httpRequest);
  // httpRequest['requesterUser'] = event.requestContext.authorizer.claims;
  const response = await controller.handle(httpRequest, httpRequest.requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );
  

  return httpResponse.toJSON();
}

export async function lambda_handler(event: any, context: any) {
  const response = await getProfilePresenter(event);
  return response;
}
