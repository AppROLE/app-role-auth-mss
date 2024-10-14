import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { UpdateProfileUseCase } from "./update_profile_usecase";
import { UpdateProfileController } from "./update_profile_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const userRepo = Environments.getUserRepo();
const authRepo = Environments.getAuthRepo();
const usecase = new UpdateProfileUseCase(authRepo, userRepo);
const controller = new UpdateProfileController(usecase);

export async function updateProfilePresenter(
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
  const response = await updateProfilePresenter(event);
  return response;
}
