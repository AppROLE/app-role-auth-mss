import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { getRequesterUser } from "src/shared/utils/get_requester_user";
import { GetAllFavoritesInstitutesController } from "./get_all_favorites_institutes_controller";
import { GetAllFavoritesInstitutesUseCase } from "./get_all_favorites_institutes_usecase";

const userRepo = Environments.getUserRepo();
const usecase = new GetAllFavoritesInstitutesUseCase(userRepo);
const controller = new GetAllFavoritesInstitutesController(usecase);

export async function getAllFavoritesInstitutesPresenter(
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
  const response = await getAllFavoritesInstitutesPresenter(event);
  return response;
}
