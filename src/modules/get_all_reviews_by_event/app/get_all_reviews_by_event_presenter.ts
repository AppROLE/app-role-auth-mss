import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { GetAllReviewsByEventUseCase } from "./get_all_reviews_by_event_usecase";
import { GetAllReviewsByEventController } from "./get_all_reviews_by_event_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const userRepo = Environments.getUserRepo();
const usecase = new GetAllReviewsByEventUseCase(userRepo);
const controller = new GetAllReviewsByEventController(usecase);

export async function getAllReviewsByEventPresenter(
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
  const response = await getAllReviewsByEventPresenter(event);
  return response;
}
