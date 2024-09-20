import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { CreateReviewUseCase } from "./create_review_usecase";
import { CreateReviewController } from "./create_review_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const userRepo = Environments.getUserRepo();
const usecase = new CreateReviewUseCase(userRepo);
const controller = new CreateReviewController(usecase);

export async function createReviewPresenter(
  event: Record<string, any>
) {
  const requesterUser = getRequesterUser(event);
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );
  

  return httpResponse.toJSON();
}

export async function lambda_handler(event: any, context: any) {
  const response = await createReviewPresenter(event);
  return response;
}
