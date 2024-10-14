import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { FollowUserUseCase } from "./follow_user_usecase";
import { FollowUserController } from "./follow_user_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const userRepo = Environments.getUserRepo();
const usecase = new FollowUserUseCase(userRepo);
const controller = new FollowUserController(usecase);

export async function followUserPresenter(
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
  const response = await followUserPresenter(event);
  return response;
}
